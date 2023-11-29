"use client";

import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  brandId: number;
};

export default function DeleteProduct({ product }: { product: Product }) {
  const { toast } = useToast();
  const router = useRouter();

  const deleteProduct = async (id: number) => {
    try {
      const res = await axios.delete(`/api/products/${id}`);

      toast({
        title: "Successfully!",
        description: "Product deleted successfully",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <Button
      onClick={() => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteProduct(product.id);
          }
        });
      }}
    >
      Delete
    </Button>
  );
}
