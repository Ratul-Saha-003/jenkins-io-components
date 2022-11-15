import {expect} from '@storybook/jest';
import {StoryObj, Meta} from '@storybook/web-components';
import {MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';
import {within, waitFor, userEvent} from '@storybook/testing-library';

import {html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import {Navbar} from '../jio-navbar';
import '../jio-navbar';

import {Searched} from './Searchbox.stories';

export default {
  title: 'Example/Navbar',
  component: 'jio-navbar',
  controls: {
    expanded: true
  },
  argTypes: {
    showSearchBox: {control: {type: 'boolean'}, },
    visibleMenu: {table: {disable: true}},
    menuToggled: {table: {disable: true}},
  }
} as Meta;

const render = ({property, showSearchBox, locationPathname}) => html`<jio-navbar
  property=${ifDefined(property)}
  .locationPathname=${ifDefined(locationPathname)}
  ?showSearchBox=${showSearchBox}
></jio-navbar>`;

export const AllLinksExternal: StoryObj<Navbar> = {
  render,
  args: {
    property: 'https://webcomponents.jenkins.io'
  }
};

export const SamePropertyActiveLink: StoryObj<Navbar> = {
  render,
  name: "Active link inside dropdown",
  args: {
    property: 'https://www.jenkins.io',
    locationPathname: '/press/'
  },
  play: async ({canvasElement}) => {
    const wc = canvasElement.querySelector("jio-navbar") as Navbar;
    const root = await waitFor(() => (wc.shadowRoot as ShadowRoot).firstElementChild as HTMLElement, {
      timeout: 5000
    });

    const screen = within(root);

    console.log('active gavin');
    const aboutDropdown = await screen.findByText('About');
    console.log('aboutDropdown', aboutDropdown);
    return userEvent.click(aboutDropdown);
  }
};

export const SamePropertyActiveToplevelLink: StoryObj<Navbar> = {
  render,
  name: "Active link outside dropdown",
  args: {
    property: 'https://www.jenkins.io',
    locationPathname: '/node/'
  }
};

export const ChangeBrand: StoryObj<Navbar> = {
  render: ({property}) => html`<jio-navbar property=${ifDefined(property)}>
    <a slot="brand" href="/" style="color: red">BRAND</a>
  </jio-navbar>`,
  args: {
    property: 'https://webcomponents.jenkins.io'
  }
};

export const ExtraRightSlot: StoryObj<Navbar> = {
  render: ({property}) => html`<jio-navbar property=${ifDefined(property)}>
    <div slot="rightMenuItems">
      <jio-navbar-link property=${ifDefined(property)} href="/myself">Profile</jio-navbar-link>
      <jio-navbar-link property=${ifDefined(property)} href="/logout">Logout</jio-navbar-link>
    </div>
  </jio-navbar>`,
  args: {
    property: 'https://webcomponents.jenkins.io'
  }
};

export const Searchbox: StoryObj<Navbar> = {
  args: {
    showSearchBox: true,
  }
};

export const SearchboxOpen: StoryObj<Navbar> = {
  args: {
    showSearchBox: true,
  },
  play: async ({canvasElement}) => {
    const wc = canvasElement.querySelector('jio-navbar') as Navbar;
    Object.defineProperty(wc.shadowRoot as unknown as HTMLElement, 'outerHTML', {value: ''}); // fake it so jest doesn't complain when using within

    await Searched.play({canvasElement: wc.shadowRoot as unknown as HTMLElement});

    const screen = within(wc.shadowRoot.querySelector('jio-searchbox').shadowRoot as unknown as HTMLElement);

    expect((await screen.findByRole('listbox')).closest('.algolia-autocomplete')).toHaveClass('algolia-autocomplete-right');
  }
};

export const MobileSearchBox: StoryObj<Navbar> = {
  args: {
    showSearchBox: true,
  },
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
      defaultViewport: 'mobile2',
    },
  },
  play: async ({canvasElement}) => {
    const wc = canvasElement.querySelector('jio-navbar') as Navbar;
    Object.defineProperty(wc.shadowRoot as unknown as HTMLElement, 'outerHTML', {value: ''}); // fake it so jest doesn't complain when using within

    userEvent.click(wc.shadowRoot.querySelector('.navbar-toggler')); // open navbar

    await Searched.play({canvasElement: wc.shadowRoot as unknown as HTMLElement});

    const screen = within(wc.shadowRoot.querySelector('jio-searchbox').shadowRoot as unknown as HTMLElement);

    expect((await screen.findByRole('listbox')).closest('.algolia-autocomplete')).toHaveClass('algolia-autocomplete-right');
  }
};
