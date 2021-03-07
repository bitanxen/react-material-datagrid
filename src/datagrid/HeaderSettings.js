import React from 'react'
import {
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch
} from '@material-ui/core'
import { DragIndicator } from '@material-ui/icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function HeaderSettings(props) {
  const {
    tool,
    closeTools,
    header,
    toggleShowHideColumn,
    columnReorderHandler
  } = props
  return (
    <Popover
      open={Boolean(tool)}
      anchorEl={tool}
      onClose={() => closeTools()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <DragDropContext onDragEnd={columnReorderHandler}>
        <Droppable droppableId="column-droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {header.map((h, index) => (
                <Draggable
                  key={h.colId}
                  draggableId={`column-draggable-${h.colId}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <MenuItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <ListItemIcon {...provided.dragHandleProps}>
                        <DragIndicator fontSize="small" />
                      </ListItemIcon>
                      <ListItemText disableTypography primary={h.colName} />
                      <Switch
                        size="small"
                        checked={h.display}
                        onChange={() => toggleShowHideColumn(h.colId)}
                        color="primary"
                        name={h.colName}
                        inputProps={{ 'aria-label': 'toggle column' }}
                      />
                    </MenuItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Popover>
  )
}

export default HeaderSettings
