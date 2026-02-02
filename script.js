console.log("hi mom!")

function generate_link(){
    let reddit_username = document.getElementById("redditUsername").value

    console.log("here " + reddit_username)

    const prefix = `site:reddit.com `

    const thatUrl = encodeURIComponent(prefix + reddit_username)
    
    const finalUrl = `https://www.google.com/search?q=${thatUrl}`
    console.log("url : " +thatUrl )

    let theArea = document.getElementById('link_generatin_Area')

    theArea.innerHTML = `<a href="${finalUrl}"> <button > find </button> </a>`
}