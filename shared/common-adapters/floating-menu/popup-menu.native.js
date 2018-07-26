// @flow
import React, {Component} from 'react'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Box, Text} from '..'
import {globalColors, globalMargins, globalStyles} from '../../styles'
import type {MenuItem, ModalLessPopupMenuProps} from './popup-menu'

// TODO refactor to use Overlay and consolidate some of these files
// popup-menu / relative-popup-hoc / floating-menu
// probably all can go in floating-menu now that everything uses that

// Menu Item
type MenuIRowProps = {
  ...MenuItem,
  isHeader?: boolean,
  index: number,
  numItems: number,
  onHidden?: ?() => void,
}

const MenuRow = (props: MenuIRowProps) => (
  <TouchableOpacity
    disabled={!props.onClick}
    onPress={() => {
      props.onHidden && props.onHidden() // auto hide after a selection
      props.onClick && props.onClick()
    }}
    style={{...styleRow(props), ...props.style}}
  >
    {props.view || (
      <Text type={'BodyBig'} style={styleRowText(props)}>
        {props.title}
      </Text>
    )}
  </TouchableOpacity>
)

const styleRow = ({
  isHeader,
  danger,
  index,
  numItems,
}: {
  isHeader?: boolean,
  danger?: boolean,
  index: number,
  numItems: number,
}) => {
  const sharedStyle = {
    ...globalStyles.flexBoxColumn,
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (isHeader) {
    return {
      ...sharedStyle,
      paddingBottom: globalMargins.medium,
      paddingTop: globalMargins.medium,
      backgroundColor: danger ? globalColors.red : globalColors.white,
    }
  }
  return {
    ...styleButtonAlert,
    backgroundColor: globalColors.white,
    borderColor: globalColors.black_05,
    ...(index === 1 ? {borderTopWidth: 1} : {}),
  }
}

const styleRowText = ({
  isHeader,
  danger,
  disabled,
}: {
  isHeader?: boolean,
  danger?: boolean,
  disabled?: boolean,
}) => {
  const dangerColor = danger ? globalColors.red : globalColors.blue
  const color = isHeader ? globalColors.white : dangerColor
  return {
    color,
    ...(disabled ? {opacity: 0.6} : {}),
    ...(isHeader ? {textAlign: 'center'} : {}),
  }
}

// Popup Menu
class PopupMenu extends Component<ModalLessPopupMenuProps> {
  render() {
    const menuItemsNoDividers = this.props.items.reduce((arr, mi) => {
      if (mi && mi !== 'Divider') {
        arr.push(mi)
      }
      return arr
    }, [])
    const menuItemsWithHeader = [
      ...(this.props.header ? [{...this.props.header, isHeader: true}] : []),
      ...menuItemsNoDividers,
    ]

    return (
      <Box style={styleOverlay}>
        <TouchableWithoutFeedback onPress={this.props.onHidden}>
          <Box style={styleFlexOne} />
        </TouchableWithoutFeedback>
        <Box style={{...styleMenu, ...this.props.style}}>
          <Box style={styleMenuGroup}>
            {menuItemsWithHeader.map((mi, idx) => (
              <MenuRow
                key={mi.title}
                {...mi}
                index={idx}
                numItems={menuItemsWithHeader.length}
                onHidden={this.props.onHidden}
              />
            ))}
          </Box>
          <Box style={{...styleMenuGroup, borderColor: globalColors.black_05, borderTopWidth: 1}}>
            <MenuRow
              title="Cancel"
              index={0}
              numItems={1}
              onClick={this.props.onHidden}
              // pass in nothing to onHidden so it doesn't trigger it twice
              onHidden={() => {}}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

const styleOverlayContainer = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const styleOverlay = {
  ...styleOverlayContainer,
  ...globalStyles.flexBoxColumn,
  justifyContent: 'flex-end',
  alignItems: 'stretch',
  backgroundColor: globalColors.black_40,
}

const styleFlexOne = {
  flex: 1,
}

const styleMenu = {
  ...globalStyles.flexBoxColumn,
  justifyContent: 'flex-end',
  alignItems: 'stretch',
  backgroundColor: globalColors.white,
}

const styleMenuGroup = {
  ...globalStyles.flexBoxColumn,
  justifyContent: 'flex-end',
  alignItems: 'stretch',
}

const styleButtonAlert = {
  ...globalStyles.flexBoxColumn,
  alignItems: 'center',
  height: 56,
  justifyContent: 'center',
  paddingLeft: globalMargins.medium,
  paddingRight: globalMargins.medium,
}

const ModalLessPopupMenu = PopupMenu

export {ModalLessPopupMenu}
