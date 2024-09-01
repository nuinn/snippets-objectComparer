const response = await fetch('/apinodetest/v1/post/isEqual', {
	method: 'POST',
	body: JSON.stringify({
    // snapshot of existing products declared when quote was originally uploaded
		obj1: this.snapshot,
    // products in edited quote
		obj2: this.prods
	}),
	headers: {
    "Content-type": "application/json; charset=UTF-8"
	}
});
const data = await response.json();
const isChange = !data.res[0];
if (isChange) {
  // products which haven't received an id from our database
	const newProducts = this.prods.filter(prod => !prod.id);
	const deletedProducts = this.snapshot.filter(sProd => !this.prods.map(prod => prod.id).includes(sProd.id));
	const existingProducts = this.prods.filter(prod => this.snapshot.map(sProd => sProd.id).includes(prod.id));
  // products which already existed in the snapshot are then checked for modifications
	const comparisonPromises = existingProducts.map(async eProd => {
		const snapshotProduct = this.snapshot.find(sProd => sProd.id === eProd.id);
		const response = await fetch('/apinodetest/v1/post/isEqual', {
			method: 'POST',
			body: JSON.stringify({
				obj1: eProd,
				obj2: snapshotProduct,
			}),
			headers: {
    		"Content-type": "application/json; charset=UTF-8"
			}
		});
		const data = await response.json();
		return { eProd, isEqual: data.res[0] }
	});
	const comparisonResults = await Promise.all(comparisonPromises);
  // any modified products are stored in the below array
	const updatedProducts = comparisonResults.filter(res => !res.isEqual).map(res => res.eProd);
	console.log(`${newProducts.length ? `${newProducts.length} new product${newProducts.length > 1 ? 's' : ''}. `: ''}${updatedProducts.length ? `${updatedProducts.length} updated product${updatedProducts.length > 1 ? 's' : ''}. `: ''}${deletedProducts.length ? `${deletedProducts.length} deleted product${deletedProducts.length > 1 ? 's' : ''}.`: ''}`);
}