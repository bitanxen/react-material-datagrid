import React, { useState, useEffect } from 'react'
import { MaterialDataGrid } from 'react-material-datagrid'
import { Add, Delete } from '@material-ui/icons'
import './style.css'
import { IconButton } from '@material-ui/core'

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
 */

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=20')
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

  return (
    <div className="App">
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
            sort: 'asc',
            avaterText: 'Hello',
            avaterSrc: (data) => {
              //console.log(data)
              return data.picture
            }
          },
          {
            colId: 'email',
            colName: 'Email ID',
            dataType: 'string',
            display: true,
            resize: true,
            width: 150,
            icon: Delete
          },
          {
            colId: 'phone',
            colName: 'Phone',
            dataType: 'string',
            display: true,
            width: 150
          },
          {
            colId: 'age',
            colName: 'Age',
            dataType: 'number',
            display: true,
            backgroundColor: (data) =>
              data.age > 70 ? '#987887' : data.age > 50 ? '#868AF9' : '#324324',
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
        dataSelected={['1', '2', '7']}
        selectionVariant="multi"
      />
    </div>
  )
}

export default App
