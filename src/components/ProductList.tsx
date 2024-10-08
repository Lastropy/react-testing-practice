import axios, { AxiosError } from "axios";
import { Product } from "../entities";
import { useQuery } from "react-query";

const ProductList = () => {
	// using react-query instead of native react
	const {
		data: products,
		error,
		isLoading,
	} = useQuery<Product[], AxiosError>({
		// used for caching and retries
		queryKey: ["products"],
		queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
	});

	if (isLoading) return <div>Loading...</div>;

	if (error) return <div>Error: {error.message}</div>;

	if (products!.length === 0) return <p>No products available.</p>;

	return (
		<ul>
			{products!.map((product) => (
				<li key={product.id}>{product.name}</li>
			))}
		</ul>
	);
};

export default ProductList;
