import { Label, Spacer, Box, Gap, TextInput, Select, Button, LineBreak, ExpandableLists, Dropdown, Item, ItemProps, Icon, generateUUID, AspectRatio, LabelColor } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

interface Props {
  
}

type List = {
  expanded: boolean,
  value: {
    item: ItemProps,
    list: ItemProps[]
  }
}

type Lists = List[]

export const Groups = ({ }: Props) => {
    const { activeSpace, groupsByGuid, addChannel, channelsByGuid, addChannelToGroup, removeChannel, removeGroup, removeChannelFromGroup, removeGroupFromSpace } = useSpaces()

    const [value, set_value] = useState<Lists>([])

    const spaceGroupGuids = activeSpace?.groupGuids
    const spaceChannelGuids = activeSpace?.groupGuids.map(groupGuid => groupsByGuid[groupGuid]?.channelGuids)

    const add = (i : number) => {
      if (activeSpace?.guid && newChannelName) {
        const guid = generateUUID()
        addChannel({
          guid,
          channel: {
            guid,
            name: newChannelName,
            groupGuid: activeSpace?.groupGuids[i],
            assetGuids: []
          }
        })
        addChannelToGroup({
          groupGuid: activeSpace.groupGuids[i],
          channelGuid: guid
        })
      }
      set_newChannelName('')
    }

    useEffect(() => {
      if (activeSpace?.groupGuids) {
        set_value(activeSpace?.groupGuids.map((groupGuid, i) => {
          const groupsList = groupsByGuid[groupGuid].channelGuids.map(channelGuid => ({
              icon: ('hashtag' as IconName),
              iconPrefix: ('fas' as IconPrefix),
              labelColor: ('none' as LabelColor),
              text: channelsByGuid[channelGuid].name
          }))
          return ({
            expanded: value[i]?.expanded || false,
            value: {
              item: {
                icon: value[i]?.expanded ? 'caret-down' : 'caret-right',
                iconPrefix: 'fas',
                labelColor: 'none',
                text: groupsByGuid[groupGuid].name,
              },
              list: [
                ...groupsList,
                {
                  content: <Box mr={-.5}><TextInput
                    value={newChannelName}
                    onChange={newValue => set_newChannelName(newValue)}
                    iconPrefix='fas'
                    autoFocus
                    compact
                    hideOutline
                    placeholder='Add channel'
                    onEnter={() => add(i)}
                    buttons={[
                      {
                        icon: 'plus',
                        iconPrefix: 'fas',
                        minimal: true,
                        onClick: () => add(i),
                        disabled: !newChannelName
                      }
                    ]}
                  />
                </Box>
                }
              ]
            }
          }
        )}
        ))
      }
     
    }, [activeSpace?.groupGuids, groupsByGuid, channelsByGuid, spaceGroupGuids, spaceChannelGuids])
  
    const [newDescription, set_newDescription] = useState('')
    const [newChannelName, set_newChannelName] = useState('')

    return (<>
        {/* <TextInput
          placeholder='Search Space'
          value={search}
          onChange={newVal => set_search(newVal)}
          compact
          iconPrefix='fas'
          canClear={!!search}
          hideOutline
        /> */}

      
      <ExpandableLists 
        
        value={value.map((expandableList, i) => ({
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              children: <>
                <Spacer />
                <Dropdown
                  icon='ellipsis-vertical'
                  iconPrefix='fas'
                  minimal
                  circle
                  items={[
                    {
                      text: 'Edit',
                      icon: 'edit',
                      iconPrefix: 'fas',
                      href: `/group/edit/${activeSpace?.groupGuids[i]}`
                    },
                    {
                      text: 'Delete',
                      icon: 'trash-alt',
                      iconPrefix: 'fas',
                      onClick: () => {
                        removeGroupFromSpace({ spaceGuid: activeSpace?.guid, groupGuid: spaceGroupGuids[i]})

                      }
                    }
                  ]}
                />
              </>
            },
            list: expandableList.value.list
            // .filter(listItem => listItem.text.toLowerCase().includes(search.toLowerCase()))
            .map((listItem, listItemIndex1) =>
              ({
                ...listItem,
                onClick: () => {},
                children: listItem.text  && <Dropdown 
                  icon='ellipsis-vertical'
                  iconPrefix='fas'
                  minimal
                  items={[
                    {
                      text: 'Rename',
                      icon: 'edit',
                      iconPrefix: 'fas',
                      onClick: () => {}
                    },
                    {
                      text: 'Delete',
                      icon: 'trash-alt',
                      iconPrefix: 'fas',
                      onClick: () => {
                        removeChannelFromGroup({ groudId: spaceGroupGuids[i], channelGuid: spaceChannelGuids[i][listItemIndex1]})
                        // removeChannel(spaceChannelGuids[i][listItemIndex1])
                        // set_value(value.map(valItem => ({
                        //   ...valItem,
                        //   value: {
                        //     ...valItem.value,
                        //     list: valItem.value.list.filter((val, listIndex) => listItemIndex1 !== listIndex)
                        //   }
                        // })))
                      }
                    }
                  ]}
                />
              })  
            )
          }
        }))}
        onExpand={index => set_value(value.map((item, i) => i === index ? ({...item, expanded: !item.expanded}) : item))}
      />
    </>
    )
}

const S = {
  Compose: styled.div`
    
  `
}