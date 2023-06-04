import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { tokens } from "../theme"

import axios from 'axios';
import config from "../config.json";

const Home = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [moneyLeft, setMoneyLeft] = useState("Loading..."); // Initialize money left
    const [ownerObjects, setOwnerObjects] = useState([]);
    const [playerObjects, setPlayerObjects] = useState([]);

    useEffect(() => {
        loadBalance(config.PLAYER_ADDRESS);
        loadObjects(config.OWNER_ADDRESS, true);
        loadObjects(config.PLAYER_ADDRESS, false);
    }, []);

    /* Loads coin balance for a given account */
    async function loadBalance(address) {
        const response = await axios.post(config.TESTNET_ENDPOINT, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "suix_getBalance",
            "params": [
              address
            ]
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          // console.log(response)
        setMoneyLeft(response.data.result.totalBalance);
    }

    /* Loads owned object information for a given account */
    async function loadObjects(address, isOwner) {
        const response = await axios.post(config.TESTNET_ENDPOINT, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "suix_getOwnedObjects",
            "params": [
                address,
                {
                "filter": {
                    "MatchAll": [
                    {
                        "StructType": `${config.PACKAGE_OBJECT_ID}::purchase::Item`
                    },
                    {
                        "AddressOwner": address
                    }
                    ]
                },
                "options": {
                    "showType": true,
                    "showOwner": true,
                    "showPreviousTransaction": false,
                    "showDisplay": false,
                    "showContent": true,
                    "showBcs": false,
                    "showStorageRebate": false
                }
                },
            ]
        });
        console.log(response);
        const objects = response.data.result.data.map(e => {
            const obj = {id: e.data.content.fields.id.id, e_type: e.data.content.fields.equipment_type};
            return obj;
        });
        // console.log(objects);
        if (isOwner) {
            setOwnerObjects(objects);
        } else {
            setPlayerObjects(objects);
        }
    }

    /* Initializes player's equipment with null values */
    const [equippedItems, setEquippedItems] = useState({
        1: { // "head"
            img: null,
        },
        2: { // "body"
            img: null,
        },
        3: { // "legs"
            img: null,
        },
        4: { // "leftArm"
            img: null,
        },
        5: { // "rightArm"
            img: null,
        }
    });

    /* Equips item to the corresponding slot in the player's equipment */
    const handleEquipItem = (e_type) => {
        setEquippedItems((prevEquippedItems) => ({
            ...prevEquippedItems,
            [`${e_type}`]: {
                img: require(`../assets/${e_type}.png`)
            }
        }))
        // console.log(equippedItems)
    };

    // useEffect(() => {
    //     console.log(equippedItems);
    // }, [equippedItems]);

    const refreshList = (address) => {
        console.log(address === config.OWNER_ADDRESS);
        loadObjects(address, address === config.OWNER_ADDRESS);
    }

    const handleAddItems = () => {
        // loadObjects(playerAddress, true);
        // fetch('http://localhost:3000/run-script')
        //     .then(response => response.text())
        //     .then(result => {
        //         console.log('Success:', result);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });
        axios({
            method: 'get',
            url: 'http://localhost:1234/add_item',
          }).then((response) => {
            console.log(response);
            loadObjects(config.OWNER_ADDRESS, true);
            loadObjects(config.PLAYER_ADDRESS, false);
          }, (error) => {
            console.log(error);
          });
    };

    const handleBuyItem = (id) => { // this function needs to add the item to inventoryData, and remove from shoppingData through API
        console.log(id);
        let url = 'http://localhost:1234/transfer?item=' + id 
        axios({
            method: 'get',
            url: url,
          }).then((response) => {
            console.log(response);
            loadObjects(config.OWNER_ADDRESS, true);
            loadObjects(config.PLAYER_ADDRESS, false);
          }, (error) => {
            console.log(error);
          });
    }

    const getExplorerLink = (address) => {
        return `https://suiexplorer.com/address/${address}?network=testnet`;
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: theme.spacing(5),
        }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' },
                gap: theme.spacing(5),
                height: '100%',
                width: '100%',
            }}>
                <Box sx={{ // human block
                    backgroundColor: colors.primary[400],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2%',
                    padding: theme.spacing(3),
                }}>
                    <Button variant="contained" 
                        sx={{
                            alignSelf: "flex-end"
                        }}
                        href={getExplorerLink(config.PLAYER_ADDRESS)}>
                        View in Explorer
                    </Button>
                    <h2>Player <br/> ({config.PLAYER_ADDRESS})</h2>
                    {
                        // head
                        equippedItems["1"].img == null ?
                            <Box sx={{ // head
                                bgcolor: "white", height: "50px", width: "50px"
                            }} >
                            </Box>
                            :
                            <Box sx={{ 
                                bgcolor: "white", height: "50px", width: "50px"
                            }} >
                                <img src={equippedItems["1"].img} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            </Box>
                    }
                    <Box sx={{
                        height: "100px",
                        width: "175px",
                        marginTop: 2,
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: "flex-end"
                    }}>
                        {
                            // left-arm
                            equippedItems["4"].img == null ?
                                <Box sx={{ 
                                    bgcolor: "white", height: "100px", width: "25px"
                                }} >
                                </Box>
                                :
                                <Box sx={{ // left-arm
                                    bgcolor: "white", height: "100px", width: "25px"
                                }} >
                                    <img src={equippedItems["4"].img} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                </Box>
                        }
                        {
                            // body
                            equippedItems["2"].img == null ?
                                <Box sx={{ 
                                    bgcolor: "white", height: "100px", width: "100px", marginLeft: 1, marginRight: 1
                                }} >
                                </Box>
                                :
                                <Box sx={{ // body
                                    bgcolor: "white", height: "100px", width: "100px", marginLeft: 1, marginRight: 1
                                }} >
                                    <img src={equippedItems["2"].img} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                </Box>
                        }
                        {
                            // right-arm
                            equippedItems["5"].img == null ?
                                <Box sx={{ 
                                    bgcolor: "white", height: "100px", width: "25px"
                                }} >
                                </Box>
                                :
                                <Box sx={{ // right-arm
                                    bgcolor: "white", height: "100px", width: "25px"
                                }} >
                                    <img src={equippedItems["5"].img} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                </Box>
                        }
                    </Box>
                    {
                        // legs
                        equippedItems["3"].img == null ?
                            <Box sx={{ 
                                backgroundColor: "white",
                                height: "150px",
                                width: "100px",
                                marginTop: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: "flex-end"
                            }}>
                                <Box sx={{
                                    backgroundColor: colors.primary[400],
                                    width: "10px",
                                    height: "150px"
                                }}></Box>
                            </Box>
                            :
                            <Box sx={{ // legs
                                backgroundColor: "white",
                                height: "175px",
                                width: "100px",
                                marginTop: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: "flex-end"
                            }}>
                                <img src={equippedItems["3"].img} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            </Box>
                    }

                    <h3>Move command line: </h3>
                    <Box sx={{
                        bgcolor: "black",
                        width: "500px",
                        height: "225px",
                        borderRadius: "10px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: "center"
                    }}
                    >
                        Move command line to be printed...
                    </Box>
                </Box>

                <Box sx={{ // shopping block and table block
                    backgroundColor: colors.primary[400],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2%',
                    padding: theme.spacing(3),
                }}>

                    <Button variant="contained" 
                        sx={{
                            alignSelf: "flex-end"
                        }}
                        href={getExplorerLink(config.OWNER_ADDRESS)}>
                        View in Explorer
                    </Button>
                    <h2> Shop Owner's List <br/> ({config.OWNER_ADDRESS}) </h2>
                    <Box // add item button and a money display
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: 400
                        }}>
                        <Button variant="contained" onClick={() => refreshList(config.OWNER_ADDRESS)}>Refresh List</Button>
                        <Button variant="contained" onClick={handleAddItems}>Add Items</Button>
                        <Typography variant="h6">Player's balance: {moneyLeft}</Typography>
                        {/* <Button variant="contained" onClick={handleAddBalance}>Add Balance + </Button> */}
                    </Box>

                    <ImageList // shopping list
                        sx={{ width: 400, height: 330 }} cols={3} rowHeight={164}>
                        {ownerObjects.map((obj) => (
                            <ImageListItem key={obj.id}>
                                <img src={require(`../assets/${obj.e_type}.png`)} onClick={() => handleBuyItem(obj.id)}/>
                            </ImageListItem>       
                        )
                        )}
                    </ImageList>

                    <h3>Inventory List</h3>
                    <Button variant="contained" 
                        sx={{
                            marginBottom: 2
                        }}
                        onClick={() => refreshList(config.PLAYER_ADDRESS)}>
                            Refresh List
                    </Button>
                    <Box // inventory list
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            flexDirection: 'row',
                            width: 400,
                            height: 150,
                        }}
                    >
                        {playerObjects.map((obj) => (
                            <Box key={obj.img} sx={{ marginRight: 0.5 }}>
                                <img
                                    // src={`${obj.img}?w=164&h=164&fit=crop&auto=format`}
                                    src={require(`../assets/${obj.e_type}.png`)}
                                    // srcSet={`${obj.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={obj.title}
                                    // loading="lazy"
                                    style={{
                                        height: '100%',
                                        width: 'auto',
                                    }}
                                    onClick={() => handleEquipItem(obj.e_type)}
                                />
                            </Box>
                        ))}
                    </Box>
                    {/* <Box // inventory list
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            flexDirection: 'row',
                            width: 400,
                            height: 150,
                        }}
                    >
                        {playerObjects.map((obj) => (
                            <ImageListItem key={obj.id}>
                                <img src={require(`../assets/${obj.e_type}.png`)} onClick={() => handleEquipItem(obj.e_type)}/>
                            </ImageListItem>
                        )
                        )}
                    </Box> */}
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
