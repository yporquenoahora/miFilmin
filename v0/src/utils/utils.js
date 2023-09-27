
export const customSort = (a,b, selectedSortOption)=> {        
                
    for (const feature of selectedSortOption) {
        
        if (a[feature] !== b[feature]) {
            if(feature =="title")
                return b[feature] < a[feature] ? 1 : -1;
            else
                return b[feature] > a[feature] ? 1 : -1;
        }
    }
    return 0; // Si todas las características son iguales
};