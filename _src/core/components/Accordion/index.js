import React, {useState} from 'react';
import Label from '@app/components/Label';
import Icon from 'react-native-vector-icons/AntDesign';
import Show from '@app/components/Show';

import Section from '@app/components/Section';
import _ from 'lodash';

const Accordion = ({item, children}) => {
  /**
   * ----------------------------------------- *
   * @constant
   * @summary list of constant local state
   * ----------------------------------------- *
   */
  const [expand, setExpand] = useState(false);

  /**
   * ----------------------------------------- *
   * @function onPressExpand
   * @summary set accordion expand or hide
   * ----------------------------------------- *
   */
  const onPressExpand = () => {
    setExpand(!expand);
  };

  return (
    <Section>
      <Section paddingVertical={5} onPress={() => onPressExpand()}>
        <Section row spaceBetween horizontalCenter verticalCenter>
          <Label large bold>
            {_.startCase(item.label)}
          </Label>
          <Icon name={expand === true ? 'up' : 'down'} />
        </Section>
      </Section>
      <Show when={expand}>
        <Section>{children}</Section>
      </Show>
    </Section>
  );
};

export default Accordion;
