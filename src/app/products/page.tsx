import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrismaClient } from "@prisma/client";
import AddProduct from "./addProduct";
import { rupiah } from "@/lib/utils";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

const getProducts = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      brandId: true,
      brand: true,
    },
  });

  return products;
};

const getBrands = async () => {
  const brands = await prisma.brand.findMany();

  return brands;
};

export default async function Product() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  return (
    <>
      <div className="mb-3">
        <AddProduct brands={brands} />
      </div>
      <h1 className="text-2xl font-bold mb-3">Products</h1>
      <Table>
        <TableCaption>A list of products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{rupiah(product.price)}</TableCell>
              <TableCell>{product.brand.name}</TableCell>
              <TableCell className="flex justify-center space-x-1">
                <DeleteProduct product={product} />
                <UpdateProduct brands={brands} product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
