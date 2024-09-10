"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ReviewForm } from "./components";

export const ProductReviews = ({ productID }: { productID: number }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {[
          {
            name: "John D.",
            rating: 5,
            comment: "Extremely comfortable and stylish. Best running shoes Ive ever owned!"
          },
          {
            name: "Sarah M.",
            rating: 4,
            comment: "Great shoes, but took a little time to break in. Overall very satisfied."
          },
          {
            name: "Mike R.",
            rating: 4,
            comment: "Good quality and fit. Would recommend to others."
          }
        ].map((review, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{review.name}</span>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ReviewForm productID={productID} />
    </div>
  );
};
