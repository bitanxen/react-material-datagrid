import React from 'react'
import { MaterialDataGrid } from 'react-material-datagrid'
import './style.css'

function App() {
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
            colId: 'age',
            colName: 'Age',
            dataType: 'number',
            display: true,
            width: 150
          },
          {
            colId: 'gender',
            colName: 'Gender',
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
          }
        ]}
        fitColumns={true}
      />
    </div>
  )
}

export default App
