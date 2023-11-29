"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import type { Brand } from "@prisma/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

type Product = {
  id: number;
  title: string;
  price: number;
  brandId: number;
};

export default function UpdateProduct({ brands, product }: { brands: Brand[]; product: Product }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const FormSchema = z.object({
    title: z.string().min(2, {
      message: "Product name must be at least 2 characters.",
    }),
    price: z.string(),
    brand: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: product.title,
      price: String(product.price),
      brand: String(product.brandId),
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    const data = JSON.stringify({
      title: values.title,
      price: Number(values.price),
      brandId: Number(values.brand),
    });

    try {
      const req = await axios.patch(`/api/products/${product.id}`, data);

      toast({
        title: "Successfully!",
        description: "Product updated successfully",
      });

      form.reset({
        title: "",
        price: "",
        brand: "",
      });
      setOpenDialog((prevState) => !prevState);

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
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand, index) => (
                            <SelectItem key={index} value={`${brand.id}`}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <Button type="submit">Edit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
