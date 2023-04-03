// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import ExpandableSection from '~components/expandable-section';
import Link from '~components/link';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import dog from './assets/dog.png';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';

const ExampleContainer = () => (
  <Container
    image={{ position: 'top', src: dog, height: 200 }}
    header={
      <Header
        variant="h2"
        headingTagOverride="h1"
        description={
          <>
            Some additional text{' '}
            <Link fontSize="inherit" variant="primary">
              with a link
            </Link>
            .
          </>
        }
        info={<Link variant="info">Info</Link>}
      >
        Container with tag override
      </Header>
    }
    footer={
      <ExpandableSection headerText="Additional settings" variant="footer">
        Place additional form fields here.
      </ExpandableSection>
    }
  >
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor,
    mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis
    vitae molestie sed. Phasellus tincidunt suscipit varius.
  </Container>
);

export default function SimpleContainers() {
  const [height, setHeight] = React.useState('0');
  const [width, setWidth] = React.useState('0');
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option | null>({
    label: 'cover',
    value: 'cover',
  });

  return (
    <article>
      <h1>Simple containers</h1>
      <ScreenshotArea>
        <SpaceBetween size="xxl">
          <SpaceBetween direction="horizontal" size="l">
            <SpaceBetween size="xs">
              <Box>Width (in px):</Box>
              <Input type="number" onChange={({ detail }) => setWidth(detail.value)} value={width} />
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box>Height (in px):</Box>
              <Input type="number" onChange={({ detail }) => setHeight(detail.value)} value={height} />
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box>object-fit:</Box>
              <Select
                selectedOption={selectedOption}
                onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                options={[
                  { label: 'cover', value: 'cover' },
                  { label: 'contain', value: 'contain' },
                  { label: 'fill', value: 'fill' },
                  { label: 'none', value: 'none' },
                  { label: 'scale down', value: 'scale-down' },
                ]}
                selectedAriaLabel="Selected"
              />
            </SpaceBetween>
          </SpaceBetween>
          <ExampleContainer />
          <ColumnLayout columns={2}>
            <ExampleContainer />
            <ExampleContainer />
          </ColumnLayout>
          <ColumnLayout columns={3}>
            <ExampleContainer />
            <ExampleContainer />
            <ExampleContainer />
          </ColumnLayout>
          <ColumnLayout columns={4}>
            <ExampleContainer />
            <ExampleContainer />
            <ExampleContainer />
            <ExampleContainer />
          </ColumnLayout>
          <SpaceBetween size="l">
            <Container
              image={{ position: 'left', src: dog }}
              header={
                <Header
                  variant="h2"
                  headingTagOverride="h1"
                  description={
                    <>
                      Some additional text{' '}
                      <Link fontSize="inherit" variant="primary">
                        with a link
                      </Link>
                      .
                    </>
                  }
                  info={<Link variant="info">Info</Link>}
                >
                  Container with tag override
                </Header>
              }
              footer={
                <ExpandableSection headerText="Additional settings" variant="footer">
                  Place additional form fields here.
                </ExpandableSection>
              }
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
              tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam
              dui tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
            </Container>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
