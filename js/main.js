// import { getLocationReviews } from './firebase-functions.js';
import {
    createReview,
    getAllLocations,
    getLocationData,
    getLocationReviews,
    getUserByID,
    getLocationByID,
    getCurrentUser,
    getServerTimestamp,
    updateLocationRating,
    auth,
    signOut,
} from "../index";


let hasReviewPermissions = false;
let currBuildingId = 0;
let currentUserID;
let buildingList;

const navElements = document.querySelectorAll('.private');

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUserID = user.uid;
        console.log('user good');
        console.log(user.uid);

        hasReviewPermissions = true;

        // const authBtn = document.getElementsByClassName('auth-btn');
        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = 'Logout';
        authBtn.setAttribute('onclick', 'signUserOut()');
        authBtn.setAttribute('href', '#');
        authBtn.style.cursor = 'pointer';
    } else {
        console.log('user bad');

        hasReviewPermissions = false;

        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = 'Sign In';
        authBtn.setAttribute('href', 'auth.html');
        authBtn.removeAttribute('onclick');

        for (let i = 0; i < navElements.length; i++) {
            navElements[i].setAttribute('href', 'auth.html')
        }
    }
});


async function initMap() {
    var options = {
        zoom: 16,
        center: { lat: 43.4723, lng: -80.5449 }
    }

    var map = new google.maps.Map(document.getElementById('map'), options);

    // Add markers for location 
    buildingList = await getAllLocations();

    for (let i = 0; i < buildingList.length; i++) {
        addMarker(buildingList[i]);
    }


    function addMarker(info) {

        var marker = new google.maps.Marker({
            position: { lat: info.latitude, lng: info.longitude },
            map: map,
        });
        var sampleinfo = new google.maps.InfoWindow({
            content: '<h1>' + info.address + '</h1>'
        });

        marker.addListener('click', async function () {
            currBuildingId = info.id;

            document.getElementById("address").innerHTML = info.address;
            document.getElementById("address2").innerHTML = info.address;
            //console.log(document.getElementById("adress").innerHTML)

            var imgTags = document.getElementsByClassName("mySlides");

            console.log(info.imageURLs)
            if (info.imageURLs.length == 0) {
                document.querySelector('.carousel').style.display = 'none';
            } else {
                document.querySelector('.carousel').style.display = 'block';
                console.log(document.querySelector('.carousel').style.display)
                for (var i = 0; i < Math.min(10, info.imageURLs.length); i++) {
                    imgTags[i].setAttribute("src", info.imageURLs[i]);
                    console.log(info.imageURLs[i])
                }
            }

            showDivs(1);
            // document.querySelector('.carousel').style.display = 'none';

            star_rating_animation(info.rating);
            price_animation(info.price);
            document.getElementById("description-info").innerHTML = info.description;
            document.getElementById("num-recommendations").innerHTML = info.recommendedCount;

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

            const locationReviews = await getLocationReviews(info.id);

            for (var i = 0; i < info.reviewIDs.length; i++) {
                var stars = "";
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= locationReviews[i].rating) {
                        stars += '<i class="fas fa-star comment-star"></i>'
                    } else {
                        stars += '<i class="far fa-star comment-star"></i>'
                    }
                }


                var new_comment = document.createElement("div");
                new_comment.setAttribute('class', 'comment');

                console.log(locationReviews[i].userID)
                var userName = "Undefined"
                if (await getUserByID(locationReviews[i].userID)) {
                    userName = (await getUserByID(locationReviews[i].userID)).firstName;
                }
                new_comment.innerHTML = '<span class="commentor">' + userName + '</span> | <span class="comment-date">' + locationReviews[i].timestamp.toDate().toDateString() + '<br>' + stars + '<br><h3 class="comment-title">' + locationReviews[i].title + '</h3> <p class="comment-body">' + locationReviews[i].description + '</p>'
                var commentStars = document.getElementsByClassName('comment-star')

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

window.initMap = initMap;


function resetbar() {
    document.getElementById("map").style.width = "100%"
    document.getElementById("info-bar").style.display = "none"
    document.getElementById("info-bar").style.width = "0%"
    document.getElementById("review-page").style.display = "none"
    document.getElementById("review-page").style.width = "0%"
}

window.resetbar = resetbar;

var slideIndex = 1;
// showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

window.plusDivs = plusDivs

async function showDivs(n) {
    var locationInfo = (await getLocationByID(currBuildingId))
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > locationInfo.imageURLs.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = locationInfo.imageURLs.length };
    for (i = 0; i < 10; i++) {
        x[i].style.opacity = "0";
        x[i].style.display = "none";
    }
    x[slideIndex - 1].style.opacity = "100";
    x[slideIndex - 1].style.display = "block";
}
window.showDivs = showDivs

function star_rating_animation(rating) {
    document.getElementById("numrating").innerHTML = "" + Math.round(rating * 10) / 10;

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
    document.getElementById("dollar1").style.display = "block";
    if (price >= 500) {
        document.getElementById("dollar2").style.display = "block";
    }
    if (price >= 1000) { document.getElementById("dollar3").style.display = "block" }
}

var userRating;
var userRecommend;
function addReview() {
    if (hasReviewPermissions) {
        document.getElementById("info-bar").style.opacity = '0';
        setTimeout(() => {
            document.getElementById("info-bar").style.zIndex = '-1';

        }, 50)
        for (var i = 1; i <= 5; i++) {
            document.getElementById("review-star" + i).setAttribute('class', 'far fa-star')
        }
        userRating = 0;
        userRecommend = false;
    } else {
        window.location.replace('auth.html');
    }



    // const review = {
    //     description: "testing",
    //     id: "testingid",
    //     title: "placeholder",
    //     reviewerID: "abc",
    // };

    // createReview('7TahmGCGceaQYEAx1Mgm', review);
}

window.addReview = addReview;


function reviewStarsClick(starNum) {
    for (var i = 1; i <= 5; i++) {
        if (i <= starNum) {
            document.getElementById("review-star" + i).setAttribute('class', 'fas fa-star')
        } else {
            document.getElementById("review-star" + i).setAttribute('class', 'far fa-star')
        }
    }
    userRating = starNum;
}
window.reviewStarsClick = reviewStarsClick;

function reviewRecommendClick(recommend) {
    if (recommend) {
        document.getElementById("review-thumbs-up").setAttribute('class', 'fas fa-thumbs-up');
        document.getElementById("review-thumbs-down").setAttribute('class', 'far fa-thumbs-down');
        userRecommend = true;
    } else {
        document.getElementById("review-thumbs-up").setAttribute('class', 'far fa-thumbs-up');
        document.getElementById("review-thumbs-down").setAttribute('class', 'fas fa-thumbs-down');
        userRecommend = false;
    }
}
window.reviewRecommendClick = reviewRecommendClick;

function click(x, y) {
    var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    var el = document.elementFromPoint(x, y);

    el.dispatchEvent(ev);
}

async function reviewSubmit() {

    let centerX = document.getElementById("map").offsetLeft + document.getElementById("map").offsetWidth / 2;
    let centerY = document.getElementById("map").offsetTop + document.getElementById("map").offsetHeight / 2;
    console.log(centerX)
    console.log(centerY)

    // click(centerX, centerY);

    var new_comment = {
        userID: currentUserID,  // change this
        timestamp: getServerTimestamp(),
        rating: userRating,
        recommended: userRecommend,
        title: document.getElementById('review-title').value,
        description: document.getElementById('review-description').value,
    };
    var locationInfo = (await getLocationByID(currBuildingId))
    var newRating = (locationInfo.rating * locationInfo.reviewIDs.length + userRating) / (locationInfo.reviewIDs.length + 1)
    var newRecommend = locationInfo.recommendedCount;
    if (userRecommend) { newRecommend += 1 }

    updateLocationRating(currBuildingId, newRating, newRecommend)
    console.log(new_comment)
    createReview(currBuildingId, new_comment).then((_) => {
        console.log('DONE!')
        location.reload();
    });

    //

    // buildingInfo[currBuildingId].comments.unshift(new_comment);
    // conmouseleave.log(buildingInfo)
}
window.reviewSubmit = reviewSubmit;


function signUserOut() {
    signOut();
    window.location.reload();
}

window.signUserOut = signUserOut;

// document.getElementById('map').addEventListener('click', (event) => {
//     console.log(event.clientX, event.clientY)
// })

// window.mouse_position = mouse_position


