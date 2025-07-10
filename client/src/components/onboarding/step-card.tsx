import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StepCardProps {
  title: string;
  children: ReactNode;
}

export default function StepCard({ title, children }: StepCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-700 p-6">
      <h3 className="text-lg font-medium text-white mb-6">{title}</h3>
      {children}
    </Card>
  );
}