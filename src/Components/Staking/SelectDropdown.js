import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall({ sortDefault, sortbyTrue, sortByFalse,sortByPriceLowToHigh,sortByPriceHighToLow }) {
  const [age, setAge] = React.useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);

if(event.target.value === 10){
  sortDefault();
}
else if(event.target.value === 20){
  sortbyTrue();
}
else if(event.target.value === 30){
  sortByFalse();
}
else if(event.target.value === 50){
  sortByPriceLowToHigh();
}
else if(event.target.value === 40){
  sortByPriceHighToLow();
}





  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-select-small-label">Sort by</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Sort by"
        onChange={handleChange}
      >
        <MenuItem value={10}>Default</MenuItem>
        <MenuItem value={20}>Staked</MenuItem>
        <MenuItem value={30}>Not Staked</MenuItem>
        <MenuItem value={40}>PTS High to Low</MenuItem>
        <MenuItem value={50}>PTS Low to High</MenuItem>
      </Select>
    </FormControl>
  );
}
