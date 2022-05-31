import Dexie from 'dexie'
const getSigningKeys = async () => {
    var db = new Dexie("signingKeyStore");
    db.version(1).stores({ keyval: "" });
    db.open().catch(function (err) {
      console.error(err.stack || err);
    });
    let keys = await db.table("keyval").get("signingKey");
    return keys;
}
export default getSigningKeys;