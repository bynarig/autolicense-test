# Reusable Components

This directory contains reusable components that can be used across the application. Below is a description of each component and how to use it.

## Components

### SearchForm

A reusable search form component that can be used to search for any type of data.

**Usage:**

```tsx
import { SearchForm } from "@/components/SearchForm";
import { z } from "zod";

// Define a schema for validation (optional)
const searchSchema = z.object({ search: z.string() });

// Use the component
<SearchForm
	onSearch={(searchTerm) => console.log(searchTerm)}
	placeholder="Search..."
	schema={searchSchema}
	defaultValue=""
/>;
```

### UsersTable

A reusable table component for displaying user data with copy-to-clipboard functionality.

**Usage:**

```tsx
import { UsersTable } from "@/components/UsersTable";

// Sample user data
const users = [
	{ id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
];

// Use the component
<UsersTable users={users} caption="User List" detailsPath="/users" />;
```

### CopyableCell

A reusable component for table cells with copy-to-clipboard functionality.

**Usage:**

```tsx
import { CopyableCell } from "@/components/CopyableCell";

// Use the component
<CopyableCell value="Text to copy" />

// With a formatter
<CopyableCell
  value={new Date()}
  formatter={(date) => date.toLocaleDateString()}
/>
```

## Hooks

### useCopyToClipboard

A custom hook that initializes clipboard functionality for elements with the specified selector.

**Usage:**

```tsx
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

function MyComponent() {
	// Initialize clipboard functionality for elements with class "copy-btn"
	useCopyToClipboard();

	// Or with a custom selector
	// useCopyToClipboard(".custom-copy-button");

	return (
		<div>
			<button className="copy-btn" data-clipboard-text="Text to copy">
				Copy
			</button>
		</div>
	);
}
```

## Services

### userService

A service for fetching user data from the API.

**Usage:**

```tsx
import { fetchUsers } from "@/services/userService";

// Fetch all users
const users = await fetchUsers();

// Search for users
const searchResults = await fetchUsers("search term");
```

## Utilities

### validateSearchInput

A utility function for validating and determining the type of search input.

**Usage:**

```tsx
import { validateSearchInput } from "@/utils/validateSearchInput";

const inputType = validateSearchInput("search term");
// Returns "id", "email", "role", or "name"
```
