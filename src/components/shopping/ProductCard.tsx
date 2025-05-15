
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, ShoppingListItem } from "@/services/productService";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface ProductCardProps {
  item: ShoppingListItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onSelectAlternative: (id: string, product: Product) => void;
}

export function ProductCard({
  item,
  onUpdateQuantity,
  onSelectAlternative,
}: ProductCardProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<Product[]>([]);

  // In a real app, we would fetch these from an API
  const mockAlternatives: Product[] = [
    {
      id: "alt1",
      name: `Alternative ${item.product?.name || item.text}`,
      description: "Similar product, different brand",
      price: item.product ? item.product.price * 0.9 : 3.99,
      image: item.product?.image || "https://i.imgur.com/JgzrFgH.jpg",
      category: item.category,
      store: "Walmart",
      inStock: true
    },
    {
      id: "alt2",
      name: `Premium ${item.product?.name || item.text}`,
      description: "Higher quality option",
      price: item.product ? item.product.price * 1.2 : 5.99,
      image: item.product?.image || "https://i.imgur.com/YtY24Ys.jpg",
      category: item.category,
      store: "Instacart",
      inStock: true
    }
  ];

  const handleToggleAlternatives = () => {
    if (!showAlternatives && alternatives.length === 0) {
      // In a real app, we would fetch alternatives from an API
      setAlternatives(mockAlternatives);
    }
    setShowAlternatives(!showAlternatives);
  };

  if (item.isProcessing) {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="shimmer w-16 h-16 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="shimmer h-5 w-3/4"></div>
              <div className="shimmer h-4 w-1/2"></div>
              <div className="shimmer h-4 w-1/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!item.product) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
              ?
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.text}</h3>
              <p className="text-sm text-muted-foreground">No matching product found</p>
              <p className="text-sm text-muted-foreground">Category: {item.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={item.product.image} 
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="font-medium">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">{item.product.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">${item.product.price.toFixed(2)}</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {item.product.store}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => item.quantity > 1 && onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAlternatives}
          >
            {showAlternatives ? "Hide alternatives" : "Show alternatives"}
          </Button>
        </div>
        
        {showAlternatives && (
          <div className="mt-4 space-y-3 pt-3 border-t">
            <h4 className="text-sm font-medium">Alternative options:</h4>
            {alternatives.map((alt) => (
              <div 
                key={alt.id}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onSelectAlternative(item.id, alt)}
              >
                <img 
                  src={alt.image} 
                  alt={alt.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h5 className="text-sm font-medium">{alt.name}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${alt.price.toFixed(2)}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                      {alt.store}
                    </span>
                  </div>
                </div>
                {item.product?.id === alt.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
