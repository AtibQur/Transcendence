<template>
        <div class="ProfileContainer">
            <div class="ProfileData">
                <div class="ProfilePicture">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style="width:100%">
                </div>
                <div class="ProfileInfo">
                    <div class="ProfileName">
                        <h1>John Doe</h1>
                    </div>
                    <div class="ProfileStatus">
                        <h3>status: Hardcoded Online</h3>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    name: "ProfilePage",
}
</script>

<style>
.ProfileContainer {
    position: absolute;
    left: 400px;
    top: 50%;
    transform: translateY(-50%);
    width: calc(100% - 800px);
    min-width: 1500px;
    height: 75%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
}

.ProfileData {
    position: absolute;
    left: 12%;
    top: 10%;
    width: 20%;
    height: 50%;
    border: 1px solid black;
}

.ProfileData .ProfilePicture {
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    width: 100%;
    height: 60%;
    border: 1px solid black;
}

.ProfileData .ProfilePicture img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.ProfileData .ProfileInfo {
    position: absolute;
    left: 0%;
    top: 60%;
    width: 100%;
    height: 40%;
    border: 1px solid black;
}



</style>