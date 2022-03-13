
import {Moralis} from 'moralis';
// const question = {
//   id: 1,
//   question: "",
//   description: "",
//   date_asked: "",
//   status: "active",
//   ipfs_hash: "asadada",
//   upvotes: 27,
//   duration: "",
//   bounty: 125
// }

const IPFSTestPage = () => {
//   const triedToEagerConnect = useEagerConnect();

  const handleDBUpload = async() =>{
    // const tbl = await connect({ network: "testnet" });

    // const createRes = await tbl.create(
    // `CREATE TABLE mytable (name text, id int, primary key (id));`, {}
    // );

    // // `queryableName` will be the table name you chose with the
    // // table id separated by and underscore 
    // const queryableName = createRes.name;
    // console.log(queryableName); // e.g. mytable_1

    // const insertRes = await tbl.query(`INSERT INTO ${queryableName} (id, name) VALUES (0, 'Bobby Tables');`);

    // const queryRes = await tbl.query(`SELECT * FROM ${queryableName};`);
    // console.log(queryRes)

    // console.log("test")
  }
  const handleDBRetrieval = async() =>{

    const Category = Moralis.Object.extend("Categories");
    const query = new Moralis.Query(Category);
    // query.equalTo("categoryName", "Web3");
    const results = await query.find();
    alert("Successfully retrieved " + results.length + " categories.");
    // // Do something with the returned Moralis.Object values
    // for (let i = 0; i < results.length; i++) {
    //   const object = results[i];
    //   alert(object.id + ' - ' + object.get('ownerName'));
    // }

    
    // const tbl = await connect({ network: "testnet" });
    // console.log(tbl);
    // const tblName = "mytable_403";

    // const queryRes = await tbl.query(`SELECT * FROM ${tblName};`);

    // const createRes = await tbl.create(
    // `CREATE TABLE mytable (name text, id int, primary key (id));`, {}
    // );

    // // `queryableName` will be the table name you chose with the
    // // table id separated by and underscore 
    // const queryableName = createRes.name;
    // console.log(queryableName); // e.g. mytable_1

    // const insertRes = await tbl.query(`INSERT INTO ${queryableName} (id, name) VALUES (0, 'Bobby Tables');`);

    // const queryRes = await tbl.query(`SELECT * FROM ${queryableName};`);
    // console.log(queryRes)
    // const tables = await tbl.list();
    // console.log(tables)
  }
  return (
    <div className="">
      <main className="">
        <div className="text-center my-40">
          <h1>IPFS Test page</h1>
          <button className="bg-gray-200 p-4" onClick={handleDBUpload}>Test upload</button>
          <button className="bg-gray-200 p-4" onClick={handleDBRetrieval}>Test retrieve</button>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default IPFSTestPage;
