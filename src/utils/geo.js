export default function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error("La géolocalisation n'est pas prise en charge par ce navigateur."));
        }
    });
}