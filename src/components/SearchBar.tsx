import { Box, Button, TextField } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, onSearch, placeholder }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        label={placeholder ?? "Buscar"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size="small"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSearch();
          }
        }}
      />
      <Button variant="outlined" onClick={onSearch}>
        Buscar
      </Button>
    </Box>
  );
}
