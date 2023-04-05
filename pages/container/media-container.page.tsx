// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// icon
// demos with breakpoints / container queries

import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import ExpandableSection from '~components/expandable-section';
import Link from '~components/link';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import dog from './assets/video.png';
import square from './assets/4-3.png';
import icon from './assets/icon.png';
import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
// Images in the same row
// Pick image per container
// Container card
// Pick object-fit
//

const ExampleContainer = (props: any) => {
  const { height, src } = props;
  console.log(height);
  return (
    <Container
      image={{ position: 'top', src: dog || dog }}
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
};

export default function SimpleContainers() {
  const [height, setHeight] = React.useState(200);
  const [width, setWidth] = React.useState('0');
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option | null>({
    label: 'cover',
    value: 'cover',
  });
  console.log({ height });
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
              <Input
                type="number"
                onChange={({ detail }) => setHeight(Number(detail.value))}
                value={height.toString()}
              />
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

          <ColumnLayout columns={2}>
            <ExampleContainer heigth={height} />
            <ExampleContainer heigth={height} />
          </ColumnLayout>
          <ColumnLayout columns={3}>
            <ExampleContainer heigth={height} />
            <ExampleContainer src={square} heigth={height} />
            <ExampleContainer heigth={height} />
          </ColumnLayout>
          <ColumnLayout columns={4}>
            <ExampleContainer heigth={height} />
            <ExampleContainer heigth={height} />
            <ExampleContainer heigth={height} />
            <ExampleContainer heigth={height} />
          </ColumnLayout>
          <ExampleContainer heigth={height} />
          {/* <SpaceBetween size="l">
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
          </SpaceBetween> */}
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
