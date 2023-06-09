<template>
        <div class="ProfileContainer">
            <div class="ProfileData">
                <div class="ProfilePicture">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style="width:100%">
                </div>
                <div class="ProfileInfo">

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
    height: 30%;
    border: 1px solid black;
}

</style>