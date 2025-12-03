// Define the shape of the Product object to match the API response.
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!res.ok) {
    // This will catch responses like 404 Not Found, 500 Internal Server Error, etc.
    throw new Error(`Failed to fetch product. Status: ${res.status}`);
  }

  const text = await res.text();
  if (!text) {
    // This handles cases where the API returns a 200 OK but an empty body.
    throw new Error(`Failed to fetch product with ID: ${id}. Received empty response from API.`);
  }

  try {
    // Now that we have a non-empty string, we can safely parse it.
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    throw new Error('Failed to parse product data from API.');
  }
}

/**
 * This is the Product Detail Page. It's a dynamic Server Component.
 * Next.js uses the folder name `[id]` to know that this is a dynamic route.
 * @param params The dynamic route parameters object, provided by Next.js.
 *               For a URL like '/products/1', params will be { id: '1' }.
 */
export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await (params as any);
  const product = await getProduct(resolvedParams.id);

  // Once the data is ready, the component renders the JSX below.
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* Left Column: Product Image */}
        <div className="md:w-1/2 flex items-center justify-center p-6">
          <img src={product.image} alt={product.title} className="w-full h-64 md:h-96 object-contain p-4" />
        </div>
        {/* Right Column: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={`text-xl ${index < Math.round(product.rating.rate) ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
            <span className="text-lg text-gray-600 ml-2">{product.rating.rate} ({product.rating.count} reviews)</span>
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-900 mb-2">
              <span className="font-bold">Price:</span> ${product.price.toFixed(2)}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-bold">Category:</span> {product.category}
            </p>
            <p className="text-lg text-gray-800 leading-relaxed">
              <span className="font-bold">Description:</span> {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
