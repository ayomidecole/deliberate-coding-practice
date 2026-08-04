import React, { type ChangeEvent, useState } from "react";

import { OrderSearchField } from "../../components/orders/order-search-field";

export function SearchOrdersFeature() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value)
  }
  

  return (
    <section aria-labelledby="find-order-heading">
      <h2 id="find-order-heading">Find an order</h2>
      <OrderSearchField
        searchTerm={searchTerm}
        onChange={handleSearchTermChange}
      />
      {searchTerm === "" ? (
        <p>Enter an order number.</p>
      ) : (
        <p>Searching for: {searchTerm}</p>
      )}
    </section>
  );
}
