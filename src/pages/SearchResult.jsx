import React, { useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductContext } from '../context/ProductsContext';

const SearchResult = () => {
    const [searchParams]= useSearchParams();
    const searchQuery= searchParams.get('search') || '';
    const {searchProducts} = useContext(ProductContext);
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {   
                const results = await searchProducts(searchQuery);
                console.log("Search results:", results);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
        if (searchQuery) {
            fetchSearchResults();
        }
    }, [searchQuery, searchProducts]);
  return (
    <div>SearchResult</div>
  )
}

export default SearchResult