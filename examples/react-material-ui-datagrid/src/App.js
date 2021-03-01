import React, { useState, useEffect } from 'react'
import { MaterialDataGrid } from 'react-material-datagrid'
import './style.css'

function App() {
  const [data, setData] = useState([])

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
            resize: true
          },
          {
            colId: 'email',
            colName: 'Email ID',
            dataType: 'string',
            display: true,
            width: 150
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
            width: 150
          },
          {
            colId: 'website',
            colName: 'Website',
            dataType: 'string',
            display: true,
            width: 150
          },
          {
            colId: 'address',
            colName: 'Address',
            dataType: 'string',
            display: true,
            width: 350
          },
          {
            colId: 'zipcode',
            colName: 'ZipCode',
            dataType: 'string',
            display: true,
            width: 150
          },
          {
            colId: 'company',
            colName: 'Company',
            dataType: 'string',
            display: true,
            width: 350
          }
        ]}
        fitColumns={true}
        data={data}
      />
    </div>
  )
}

export default App
