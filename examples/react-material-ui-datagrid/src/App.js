import React, { useState, useEffect } from 'react'
import { MaterialDataGrid } from 'react-material-datagrid'
import { Add, Delete } from '@material-ui/icons'
import './style.css'
import { Button } from '@material-ui/core'

function App() {
  const [data, setData] = useState([])

  /*
 useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        setData(
          json.map((j) => ({
            userId: j.id,
            firstName: j.name.split(' ')[0],
            lastName: j.name.split(' ')[1],
            email: j.email,
            age: Math.random() * (60 - 20) + 20,
            phone: j.phone,
            website: j.website,
            address: `${j.address.street} ${j.address.suite}`,
            zipcode: j.address.zipcode,
            company: j.company.name
          }))
        )
      })
  }, [])

  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*': {
          'scrollbar-width': 'thin',
        },
        '*::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
        }
      }
    }
  }
 */

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=50')
      .then((response) => response.json())
      .then((json) => {
        setData(
          json.results.map((j, index) => ({
            userId: index,
            firstName: j.name.first,
            lastName: j.name.last,
            email: j.email,
            age: j.dob.age,
            phone: j.phone,
            nationality: j.nat,
            address: `${j.location.city} ${j.location.state} ${j.location.country}`,
            zipcode: j.location.postcode,
            registered: j.registered.date,
            picture: j.picture.large
          }))
        )
      })
  }, [])

  console.log(data)

  const openSubscriberExtension = (selectedData) => {
    console.log(selectedData)
  }

  /*
<div style={{ width: toggle ? '30%' : '10%' }}>
        <button
          onClick={() => {
            setToggle(!toggle)
            dataGridService.emitEvent()
          }}
        >
          Toggle
        </button>
      </div>
      toggle ? '70%' : '90%'
  */

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div style={{ width: '100%' }}>
        <MaterialDataGrid
          tableName="Material UI Table"
          header={[
            {
              colId: 'userId',
              isIdCol: true,
              colName: 'User ID',
              dataType: 'string',
              display: true,
              resize: true
            },
            {
              colId: 'username',
              colName: 'Name',
              dataType: 'string',
              dataValue: (data) => `${data.firstName} ${data.lastName}`,
              display: true,
              width: 250,
              maxWidth: 350,
              resize: true,
              backgroundColor: '#f0f0f0',
              clickHandler: (data, header) => {
                console.log(data)
              },
              sort: 'asc',
              avaterText: 'Hello',
              avaterSrc: (data) => {
                //console.log(data)
                return data.picture
              },
              freezable: true,
              freeze: false
            },
            {
              colId: 'email',
              colName: 'Email ID',
              dataType: 'string',
              display: true,
              resize: true,
              width: 150,
              clickHandler: () => {},
              icon: Delete
            },
            {
              colId: 'edit',
              colName: 'Edit',
              dataType: 'button',
              dataValue: (data) => `${data.firstName} ${data.lastName}`,
              buttonColor: 'primary',
              buttonVariant: 'contained',
              clickHandler: (data, header) => {
                console.log(data)
              },
              display: true,
              resize: true,
              width: 150
            },
            {
              colId: 'phone',
              colName: 'Phone',
              dataType: 'boolean',
              display: true,
              width: 150
            },
            {
              colId: 'age',
              colName: 'Age',
              dataType: 'number',
              display: true,
              clickHandler: (data, header) => {
                console.log(data)
              },
              backgroundColor: (data) =>
                data.age > 70
                  ? '#987887'
                  : data.age > 50
                  ? '#868AF9'
                  : '#324324',
              width: 150
            },
            {
              colId: 'nationality',
              colName: 'Nationality',
              dataType: 'string',
              display: true,
              backgroundColor: (data) =>
                data.nationality[0] === 'C' ? '#868AF9' : '#324324',
              width: 150
            },
            {
              colId: 'address',
              colName: 'Address',
              dataType: 'string',
              display: true,
              width: 100
            },
            {
              colId: 'zipcode',
              colName: 'ZipCode',
              dataType: 'string',
              display: true,
              width: 150
            },
            {
              colId: 'registered',
              colName: 'Registed On',
              dataType: 'string',
              display: true,
              width: 350
            }
          ]}
          fitColumns={true}
          data={data}
          tableTools={[
            {
              name: 'Add',
              icon: Add,
              clickHandler: () => {
                console.log('add')
              },
              display: true
            },
            {
              name: 'Delete',
              icon: Delete,
              clickHandler: (event, selectedData) => {
                openSubscriberExtension(selectedData)
              },
              display: true
            }
          ]}
          selectionVariant="multi"
          dataSelectionHandler={() => {}}
          rowsPerPageOptions={[5, 15]}
          defaultRowsPerPage={5}
          strictBodyHeight={true}
          settingsProps={{
            searchable: true,
            filterable: true,
            ordering: true,
            freezeColumm: true,
            resizeColumn: true
          }}
          tableBottomActions={(data) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px'
              }}
            >
              <div style={{}}>
                <Button
                  disabled={!data || data.length === 0}
                  variant="outlined"
                  color="primary"
                >
                  Start
                </Button>
              </div>
              <div>
                <Button
                  disabled={!data || data.length === 0}
                  variant="contained"
                  color="secondary"
                >
                  Start
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default App
