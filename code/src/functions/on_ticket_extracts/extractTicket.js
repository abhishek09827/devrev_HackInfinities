export async function fetchData() {
    try {
        const response = await fetch('https://api.devrev.ai/works.list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIiwiZXhwIjoxODAyMTcwNzI0LCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VpZCI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by9zdXBlcjphdXRoMF91c2VyL2xpbmtlZGlufGU1ZXpxX3FVQ1IiLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJsaW5rZWRpbnxlNWV6cV9xVUNSIiwiaHR0cDovL2RldnJldi5haS9kZXZvX2RvbiI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xbDBUcmJaRnR0IiwiaHR0cDovL2RldnJldi5haS9kZXZvaWQiOiJERVYtMWwwVHJiWkZ0dCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6ImFiaGlzaGVrazA5ODI3IiwiaHR0cDovL2RldnJldi5haS9lbWFpbCI6ImFiaGlzaGVrazA5ODI3QGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJBYmhpc2hlayBLYXVzaGlrIiwiaHR0cDovL2RldnJldi5haS9pc192ZXJpZmllZCI6dHJ1ZSwiaHR0cDovL2RldnJldi5haS90b2tlbnR5cGUiOiJ1cm46ZGV2cmV2OnBhcmFtczpvYXV0aDp0b2tlbi10eXBlOnBhdCIsImlhdCI6MTcwNzU2MjcyNCwiaXNzIjoiaHR0cHM6Ly9hdXRoLXRva2VuLmRldnJldi5haS8iLCJqdGkiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMWwwVHJiWkZ0dDp0b2tlbi8xa0JOajB6OCIsIm9yZ19pZCI6Im9yZ19JTTBiYlFTdWJhVEcwZzFNIiwic3ViIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIn0.RIN5euf91TsoKySuvUybS-sf0SXiRNje10LjxOqE3wL2mMCePhAlajwsfptg5MDVud4kTovqU7CIL2E92kzPDu7PaEqhe6YkjdJ2nm90vgOacH489E7gZmSUALSpMqaTHtxjRckfjAjt60PzyxGBFt3ya-Y-q9jxkpZtxlHiBmCc5DtwYbqqCYJ098YPbuGtUQ2oXW4fbh66DaiYkp_26WaQR5bvzeMoDK0JHKnu2kLuh8lpFiXUVHOd0e9BzKmYlwtSFRiGl_A5_QoYyyOTkWx9NWxPIP0pxS8TUvhcOFdRNgNhn6mN7JNIqhchHikqjUUeivQEfpRS0nhr7XzW6w`,
                // Add any other headers as needed
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export async function fetchReviews(tag) {
    let body = []
    const review = await fetchData();
    const reviews = review.works

    reviews.forEach(work => {
        const type = work.type;
        const tags = work.tags;
        if (type=="ticket") {
            tags?.map((i) => {
                const t = i.tag?.name;
                if(t == tag){
                    body.push(work.body) 
                }
            });
                
        }


        

    });
    return body.slice(0,10);
    // 
    
}

export async function ticket(keyword) {


const data = await fetchData();



// Example usage
const keyword = "Instagram";
function getTicketsByKeyword(data, keyword) {
    const tickets = data.works.filter(work => work.body.includes(keyword));
    return tickets;
}
const tickets = getTicketsByKeyword(data, keyword);
let body = []
console.log("Ticks", tickets);
tickets.forEach(work => {
    console.log("type", work.type);
        if (work.type=="ticket") {
            body.push(work.body)   
        }


        

    });
    let orderedString = '';

body.forEach((element, index) => {
  orderedString += `${index + 1}. ${element}\n`;
});
    return orderedString;

}
export async function fetchReviewsWithoutTag() {
    let body = []
    const review = await fetchData();
    const reviews = review.works

    reviews.forEach(work => {
        const type = work.type;
        const tags = work.tags;
        if (type=="ticket") {
            tags?.map((i) => {
                const t = i.tag?.name;
                    body.push(work.body) 
            });
                
        }


        

    });
    return body.slice(0,10);
    // 
    
}
