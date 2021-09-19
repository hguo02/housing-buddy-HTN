// import { getLocationReviews } from './firebase-functions.js';
// import { createReview } from '../index.js';

var users = [
    {
        userid: "hitanshud123",
        name: "Hitanshu Dalwadi",
        password: "pass1",
        points: 10
    },
    {
        userid: "vlad",
        name: "Nicholas",
        password: "pass2",
        points: 12
    },
    {
        userid: "zesponge",
        name: "Mario Su",
        password: "pass3",
        points: 1
    },
    {
        userid: "hguo",
        name: "Henry Guo",
        password: "pass4",
        points: 19
    }
]
var buildingInfo = [
    {
        id: 0,
        lat: 43.466667,
        lng: -80.516670,
        adress: "sample Adress 123",
        imglist: ["img/domus1.jpeg", "img/domus2.jpeg", "img/domus3.jpeg", "img/domus4.jpeg"],
        rating: 3.9,
        price: 715,
        dsecription: "This is the sample description for the first marker.<br>This is the best place to live in as a student studying in the University of Waterloo",
        comments: [
            {
                user: users[0],
                date: new Date('December 17, 1995 03:24:00'),
                title: "This place is amazing!!!",
                dsecription: "I lived here for 8 months, and it was the best experience I ever had. THe place is fully furnished, has all the amenities, and the staff is really nice.",
                likes: 10,
                dislikes: 2,
            },
            {
                user: users[2],
                date: new Date('December 10, 2095 03:24:00'),
                title: "This place is amazing!!!",
                dsecription: "I lived here for 8 months, and it was the best experience I ever had. THe place is fully furnished, has all the amenities, and the staff is really nice.",
                likes: 10,
                dislikes: 2,
            },
            {
                user: users[1],
                date: new Date('December 111, 2095 03:24:00'),
                title: "This placalsdkflksaje is amazing!!!",
                dsecription: "I lived hasdlkasldfkaslkjfere for 8 months, and it was the best experience I ever had. THe place is fully furnished, has all the amenities, and the staff is really nice.",
                likes: 10,
                dislikes: 2,
            }
        ]
    },

    {
        id: 1,
        lat: 43.5,
        lng: -80.6,
        adress: "sample Adress 321",
        imglist: ["img/domus1.jpeg", "img/domus2.jpeg"],
        rating: 2.6,
        price: 415,
        dsecription: "This is the sample description for the second marker.<br>This is the best place to live in as a student studying in the University of Waterloo",
        comments: []
    }
]
var currBuildingId = 0;

function initMap() {
    var options = {
        zoom: 14,
        center: { lat: 43.4723, lng: -80.5449 }
    }

    var map = new google.maps.Map(document.getElementById('map'), options);

    // add sample marker 
    addMarker(buildingInfo[0]);
    addMarker(buildingInfo[1]);


    function addMarker(info) {

        var marker = new google.maps.Marker({
            position: { lat: info.lat, lng: info.lng },
            map: map
        });

        var sampleinfo = new google.maps.InfoWindow({
            content: '<h1>' + info.adress + '</h1>'
        });

        marker.addListener('click', function () {
            currBuildingId = info.id;

            document.getElementById("address").innerHTML = info.adress;
            document.getElementById("address2").innerHTML = info.adress;
            //console.log(document.getElementById("adress").innerHTML)

            var imgTags = document.getElementsByClassName("mySlides");
            for (var i = 0; i < Math.min(10, info.imglist.length); i++) {
                imgTags[i].setAttribute("src", info.imglist[i]);
            }
            star_rating_animation(info.rating);
            price_animation(info.price);
            document.getElementById("description-info").innerHTML = info.dsecription;

            document.getElementsByClassName("comment-section")[0].innerHTML = '';
            // old_comments = document.getElementsByClassName("comment");
            // console.log(document.getElementsByClassName("comment"))
            // for (var i = 0; ; i++) {
            //     if (old_comments[i]) {
            //         old_comments[i].remove();
            //     } else {
            //         break;
            //     }
            // }
            // console.log(document.getElementsByClassName("comment"))

            for (var i = 0; i < info.comments.length; i++) {
                new_comment = document.createElement("div");
                new_comment.setAttribute('class', 'comment');
                new_comment.innerHTML = '<span class="commentor">' + info.comments[i].user.userid + '</span> | <span class="comment-date">' + info.comments[i].date.toDateString() + '</span><h3 class="comment-title">' + info.comments[i].title + '</h3> <p class="comment-body">' + info.comments[i].dsecription + '</p>'
                document.getElementsByClassName("comment-section")[0].appendChild(new_comment);
            }

            map.setCenter({ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() })
            //sampleinfo.open(map, marker);
            document.getElementById("map").style.width = "70%"
            document.getElementById("info-bar").style.display = "flex"
            document.getElementById("info-bar").style.width = "30%"
            document.getElementById("info-bar").style.opacity = "100%"
            document.getElementById("info-bar").style.zIndex = "2"
            document.getElementById("review-page").style.width = "30%"
            document.getElementById("review-page").style.display = "flex"

        });
    }
}


function resetbar() {
    document.getElementById("map").style.width = "100%"
    document.getElementById("info-bar").style.display = "none"
    document.getElementById("info-bar").style.width = "0%"
    document.getElementById("review-page").style.display = "none"
    document.getElementById("review-page").style.width = "0%"
}



var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    console.log(currBuildingId)
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > buildingInfo[currBuildingId].imglist.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = buildingInfo[currBuildingId].imglist.length };
    for (i = 0; i < buildingInfo[currBuildingId].imglist.length; i++) {
        x[i].style.opacity = "0";
        x[i].style.display = "none";

    }
    x[slideIndex - 1].style.opacity = "100";
    x[slideIndex - 1].style.display = "block";
}


function star_rating_animation(rating) {
    document.getElementById("numrating").innerHTML = "" + rating;

    rating = Math.round(rating * 2) / 2;

    for (var i = 1; i < 6; i++) {
        document.getElementById("star" + i).setAttribute('class', 'far fa-star');
    }

    if (rating >= 0.5) { document.getElementById("star1").setAttribute('class', 'fas fa-star-half-alt') }
    if (rating >= 1) { document.getElementById("star1").setAttribute('class', 'fas fa-star') }
    if (rating >= 1.5) { document.getElementById("star2").setAttribute('class', 'fas fa-star-half-alt') }
    if (rating >= 2) { document.getElementById("star2").setAttribute('class', 'fas fa-star') }
    if (rating >= 2.5) { document.getElementById("star3").setAttribute('class', 'fas fa-star-half-alt') }
    if (rating >= 3) { document.getElementById("star3").setAttribute('class', 'fas fa-star') }
    if (rating >= 3.5) { document.getElementById("star4").setAttribute('class', 'fas fa-star-half-alt') }
    if (rating >= 4) { document.getElementById("star4").setAttribute('class', 'fas fa-star') }
    if (rating >= 4.5) { document.getElementById("star5").setAttribute('class', 'fas fa-star-half-alt') }
    if (rating >= 5) { document.getElementById("star5").setAttribute('class', 'fas fa-star') }
}

function price_animation(price) {

    document.getElementById("numprice").innerHTML = "$" + price;
    for (var i = 1; i < 4; i++) {
        document.getElementById("dollar" + i).style.display = "none";
    }
    console.log(price >= 500);
    document.getElementById("dollar1").style.display = "block";
    if (price >= 500) {
        document.getElementById("dollar2").style.display = "block";
        console.log("lakjdf")
    }
    if (price >= 1000) { document.getElementById("dollar3").style.display = "block" }
}

var userRating;
var userRecommend;
function addReview() {
    document.getElementById("info-bar").style.opacity = '0';
    setTimeout(() => {
        document.getElementById("info-bar").style.zIndex = '-1';

    }, 50)
    for (var i = 1; i <= 5; i++) {
        document.getElementById("review-star" + i).setAttribute('class', 'far fa-star')
    }
    userRating = 0;
    userRecommend = false;


}


function reviewStarsClick(starNum) {
    for (var i = 1; i <= 5; i++) {
        if (i <= starNum) {
            document.getElementById("review-star" + i).setAttribute('class', 'fas fa-star')
        } else {
            document.getElementById("review-star" + i).setAttribute('class', 'far fa-star')
        }
    }
    uesrRating = starNum;
}

function reviewRecommendClick(recommend) {
    if (recommend) {
        document.getElementById("review-thumbs-up").setAttribute('class', 'fas fa-thumbs-up');
        document.getElementById("review-thumbs-down").setAttribute('class', 'far fa-thumbs-down');
    } else {
        document.getElementById("review-thumbs-up").setAttribute('class', 'far fa-thumbs-up');
        document.getElementById("review-thumbs-down").setAttribute('class', 'fas fa-thumbs-down');
    }
}
function logIN() {
    var username = document.getElementById("userid").value
    var password = document.getElementById("password").value

    for (i = 0; i < users.length(); i++) {
        if (username == users[i].userid && password == users[i].password) {
            console.log(username + 'has logged in');
        }
    }
}


