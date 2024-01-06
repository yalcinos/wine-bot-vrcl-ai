export const wineProductData = (productInfos: any, websiteUrl: string) => {
  const products = productInfos.products.map((product: any) => {
    return `<product>
                <wine>
                <url>${websiteUrl}product/${product.slug}</url>
                <name>${product.title}</name>
                <description>${product.teaser}</description>
                ${
                  product?.wine?.type
                    ? `<type>${product.wine.type} Wine</type>`
                    : ""
                }
                ${
                  product?.wine?.varietal
                    ? `<varietal>${product.wine.varietal}</varietal>`
                    : ""
                }
                ${product?.variants?.map((variant: any) => {
                  if (variant.price) {
                    return `<price>${variant.price.toFixed(2)}</price>`;
                  } else return "";
                })}
                <availability>in stock</availability>
                </wine> 
            </product>\n`;
  });

  return `
        <url>
        <location>${websiteUrl}</location>
        <description>Your wine store</description>
        ${products.join(" ")}
        </url>
`;
};
