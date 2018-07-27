// @flow
import React, {Component} from 'react'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Box, Text} from '../..'
import {globalColors, globalMargins, globalStyles, styleSheetCreate, collapseStyles} from '../../../styles'
import type {MenuItem, MenuLayoutProps} from '.'

type MenuRowProps = {
  ...MenuItem,
  isHeader?: boolean,
  index: number,
  numItems: number,
  onHidden?: ?() => void,
}

const MenuRow = (props: MenuRowProps) => (
  <TouchableOpacity
    disabled={!props.onClick}
    onPress={() => {
      props.onHidden && props.onHidden() // auto hide after a selection
      props.onClick && props.onClick()
    }}
    style={styleRow(props)}
  >
    {props.view || (
      <Text type={'BodyBig'} style={styleRowText(props)}>
        {props.title}
      </Text>
    )}
  </TouchableOpacity>
)

class MenuLayout extends Component<MenuLayoutProps> {
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
      <Box style={styles.overlay}>
        {/* Majority of screen grayed out that isn't the popup menu */}
        <TouchableWithoutFeedback onPress={this.props.onHidden}>
          <Box style={styles.styleFlexOne} />
        </TouchableWithoutFeedback>
        <Box style={collapseStyles([styles.menuBox, this.props.style])}>
          <Box style={styles.menuGroup}>
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
          <Box style={styles.cancelGroup}>
            <MenuRow
              title="Cancel"
              index={0}
              numItems={1}
              onClick={this.props.onHidden} // pass in nothing to onHidden so it doesn't trigger it twice
              onHidden={() => {}}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

const styleRow = (props: {isHeader?: boolean, danger?: boolean, index: number, numItems: number}) => {
  let rowStyle
  if (props.isHeader) {
    rowStyle = collapseStyles([
      styles.rowHeader,
      {backgroundColor: props.danger ? globalColors.red : globalColors.white},
    ])
  } else {
    rowStyle = collapseStyles([styles.row, {borderTopWidth: props.index === 1 ? 1 : undefined}])
  }
  return rowStyle
}

const styleRowText = (props: {isHeader?: boolean, danger?: boolean, disabled?: boolean}) => {
  const dangerColor = props.danger ? globalColors.red : globalColors.blue
  const color = props.isHeader ? globalColors.white : dangerColor
  return {color, ...(props.disabled ? {opacity: 0.6} : {}), ...(props.isHeader ? {textAlign: 'center'} : {})}
}

const styles = styleSheetCreate({
  notMenuBox: {
    flex: 1,
  },
  menuBox: {
    ...globalStyles.flexBoxColumn,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: globalColors.white,
  },
  menuGroup: {
    ...globalStyles.flexBoxColumn,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  cancelGroup: {
    ...globalStyles.flexBoxColumn,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    borderColor: globalColors.black_05,
    borderTopWidth: 1,
  },
  rowHeader: {
    ...globalStyles.flexBoxColumn,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: globalMargins.medium,
    paddingTop: globalMargins.medium,
  },
  row: {
    ...globalStyles.flexBoxColumn,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    paddingLeft: globalMargins.medium,
    paddingRight: globalMargins.medium,
    backgroundColor: globalColors.white,
    borderColor: globalColors.black_05,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    ...globalStyles.flexBoxColumn,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: globalColors.black_40,
  },
})

export default MenuLayout
