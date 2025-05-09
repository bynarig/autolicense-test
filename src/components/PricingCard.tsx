import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const CheckIcon = ({ className = "" }) => (
	<Check className={`h-5 w-5 ${className}`} />
);

const XIcon = ({ className = "" }) => <X className={`h-5 w-5 ${className}`} />;

const FeatureItem = ({ included = true, feature = "" }) => (
	<li className="flex items-center space-x-3 py-2">
		{included ? (
			<CheckIcon className="text-primary flex-shrink-0" />
		) : (
			<XIcon className="text-muted-foreground flex-shrink-0" />
		)}
		<span className={included ? "" : "text-muted-foreground"}>
			{feature}
		</span>
	</li>
);

export const PricingCard = ({
	title,
	price,
	description,
	features,
	buttonText,
	popular = false,
	disabled = false,
}: {
	title: string;
	price: string;
	description: string;
	features: { included: boolean; text: string }[];
	buttonText: string;
	popular?: boolean;
	disabled?: boolean;
}) => (
	<div
		className={`relative rounded-2xl border ${popular ? "border-primary shadow-lg" : "border-border"} bg-card p-6 sm:p-8 flex flex-col h-full`}
	>
		{popular && (
			<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
				Most Popular
			</div>
		)}

		<div className="mb-5">
			<h3 className="text-2xl font-bold">{title}</h3>
			<p className="mt-2 text-muted-foreground">{description}</p>
		</div>

		<div className="mb-5">
			<span className="text-5xl font-bold">${price}</span>
			<span className="text-muted-foreground">/month</span>
		</div>

		<ul className="mb-8 space-y-1 text-sm flex-grow">
			{features.map((feature, index) => (
				<FeatureItem
					key={index}
					included={feature.included}
					feature={feature.text}
				/>
			))}
		</ul>

		<Button
			className="w-full mt-auto"
			variant={popular ? "default" : "outline"}
			disabled={disabled}
		>
			{buttonText}
		</Button>
	</div>
);
