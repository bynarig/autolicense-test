import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFormProps {
	onSearch: (searchTerm: string) => void;
	placeholder?: string;
	schema?: z.ZodType<any, any>;
	defaultValue?: string;
}

/**
 * A reusable search form component
 */
export function SearchForm({
	onSearch,
	placeholder = "Search...",
	schema = z.object({ search: z.string() }),
	defaultValue = "",
}: SearchFormProps) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			search: defaultValue,
		},
	});

	// Get the current search value from the form
	const searchValue = form.watch("search");

	// Debounce the search value to reduce API calls
	const debouncedSearchValue = useDebounce(searchValue, 300);

	// Trigger search when debounced value changes
	useEffect(() => {
		if (debouncedSearchValue !== undefined) {
			onSearch(debouncedSearchValue);
		}
	}, [debouncedSearchValue, onSearch]);

	const handleSubmit = (data: { search: string }) => {
		onSearch(data.search);
	};

	return (
		<div className="flex max-w-sm w-full space-x-2">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-8 w-full"
				>
					<div className="flex flex-row space-y-4">
						<FormField
							control={form.control}
							name="search"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											type="text"
											placeholder={placeholder}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">
							<Search />
							Search
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
