// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Header from '~components/header';
import Form from '~components/form';
import Link from '~components/link';
import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Container from '~components/container';
import ScreenshotArea from '../utils/screenshot-area';

export default function FormScenario() {
  return (
    <ScreenshotArea>
      <div data-analytics="form" data-analytics-type="funnel">
        <Form
          header={
            <Header
              variant="h1"
              description="You can find more examples in Form field documentation page"
              info={<Link variant="info">Info</Link>}
            >
              Form header
            </Header>
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link">Cancel</Button>
              <Button variant="primary">Submit</Button>
            </SpaceBetween>
          }
          errorText="This is an error!"
          errorIconAriaLabel="Error"
        >
          <SpaceBetween direction="vertical" size="l">
            <Container
              data-analytics="form-section-1"
              data-analytics-type="eventContext"
              header={<Header variant="h2">Form section header 1</Header>}
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="First field" errorText="This is a form field error">
                  <Input value="" readOnly={true} />
                </FormField>
                <FormField label="Second field" errorText="This is a form field error">
                  <Input value="" readOnly={true} />
                </FormField>
              </SpaceBetween>
            </Container>
            <Container
              data-analytics="form-section-2"
              data-analytics-type="eventContext"
              header={<Header variant="h2">Form section header 2</Header>}
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="Third field" errorText="This is a form field error">
                  <Input value="" readOnly={true} />
                </FormField>
                <FormField label="Forth field">
                  <Input value="" readOnly={true} />
                </FormField>
              </SpaceBetween>
            </Container>
          </SpaceBetween>
        </Form>
      </div>
    </ScreenshotArea>
  );
}
