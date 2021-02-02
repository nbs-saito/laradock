import { useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ipcRenderer } from "electron";

const IndexPage = () => {
  useEffect(() => {
    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', (_event, args) => {
      alert(args)
    })
  }, [])

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  const onSayHiClick = () => {
    global.ipcRenderer.send('message', 'hi from next')
  }

  const hoge = () => {
    const axios = require('axios');
    var args = {
        data: { email: "a.saito@nihon-bs.com", password: "Zaq!2wsx" },
        headers: { "Content-Type": "application/json" }
    }

    let token = "";
    //axios.post("http://127.0.0.1:8000/api/auth/login", { 
    axios.post("https://nbsapi-okjzvgk4ga-an.a.run.app/api/auth/login", {
      email: "a.saito@nihon-bs.com",
      password: "Zaq!2wsx"
    })
    .then(function (response:any) {
        token = response.data.token;

        axios.get("https://nbsapi-okjzvgk4ga-an.a.run.app/api/makecsv", {
          headers: {
            "Authorization" : "Bearer " + token
          }
        })
        .then(function (response:any) {

            //downloadcsv
            //http://127.0.0.1:8000/api/downloadcsv?fileId=yahoo_item_601398da9b40f.tmp

            response.data.forEach(fileId => {
              axios.get("https://nbsapi-okjzvgk4ga-an.a.run.app/api/downloadcsv?fileId="+fileId, {
                headers: {
                  "Authorization" : "Bearer " + token
                }
              })
              .then(function (response:any) {
                  alert(response.data);
                  
                  let result = ipcRenderer.sendSync('saveCsv', response.data, fileId);
                  alert(result);
                  //downloadcsv
                  //http://127.0.0.1:8000/api/downloadcsv?fileId=yahoo_item_601398da9b40f.tmp
  
              })
            });

        })

        //downloadcsv
        //http://127.0.0.1:8000/api/downloadcsv?fileId=yahoo_item_601398da9b40f.tmp
        })
    .catch(function (error:any) {
        console.log(error)
        alert('hoge');
        })
    .then(function () {
        console.log ("*** 終了 ***")
        alert('hoge');
        })
  }

  const classes = useStyles();

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <TextField
        id="datetime-local"
        label="開始日時"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="datetime-local"
        label="終了日時"
        type="datetime-local"
        defaultValue="2017-05-24T10:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" onClick={hoge}>
        ゲット
      </Button>
    </Layout>
  )
}

export default IndexPage
