import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import 'jquery-slimscroll/jquery.slimscroll.min';
import contactList from '../data/contactList';
import ContactList from 'components/contact/ContactList';
import SearchBox from 'components/SearchBox/index';
import AddContact from 'components/contact/AddContact';

let contactId = 723812738;

const filterOptions = [
    {
        id: 1,
        name: 'All contacts',
        icon: 'zmdi-menu'
    }, {
        id: 2,
        name: 'Frequently contacted',
        icon: 'zmdi-time-restore'

    }, {

        id: 3,
        name: 'Starred contacts',
        icon: 'zmdi-star'
    }
];

class Contact extends Component {

    ContactSideBar = (user) => {
        return <div className="module-side">
            <div className="module-side-header">

                <div className="module-logo mb-4">
                    <i className="zmdi zmdi-account-box mr-4"/>
                    <span>Contacts</span>
                </div>

                <div className="user-detail d-flex flex-row mb-3">
                    <img className="rounded-circle size-40" alt={user.name}
                         src={user.avatar}/>
                    <div className="module-user-info mx-2 mt-1 mb-0  ">
                        <div className="module-title">
                            <h5 className="mb-0 text-white">{user.name}</h5></div>
                        <div className="module-user-detail">
                            <a href="javascript:void(0)"
                               className="text-white">{user.email}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="module-side-content">
                <div className="module-side-scroll">
                    <div className="module-side-nav">
                        <ul className="module-nav">
                            {filterOptions.map(option => <li key={option.id} className="nav-item">
                                    <a href="javascript:void(0)"
                                       className={option.id === this.state.selectedSectionId ? 'active' : ''} onClick={
                                        this.onFilterOptionSelect.bind(this, option)
                                    }>
                                        <i className={`zmdi ${option.icon}`}/>
                                        <span>{option.name}</span>
                                    </a>
                                </li>
                            )}

                        </ul>
                    </div>
                </div>
            </div>
        </div>

    };

    addFavourite = (data) => {
        this.setState({
            alertMessage: data.starred ? 'Contact removed as star' : 'Contact marked as star',
            showMessage: true,
            contactList: this.state.contactList.map((contact) => contact.id === data.id ? {
                ...contact,
                starred: !data.starred
            } : contact),
            allContact: this.state.allContact.map((contact) => contact.id === data.id ? {
                ...contact,
                starred: !data.starred
            } : contact)
        })
    };
    onContactSelect = (data) => {
        data.selected = !data.selected;
        let selectedContacts = 0;
        const contactList = this.state.contactList.map(contact => {
                if (contact.selected) {
                    selectedContacts++;
                }
                if (contact.id === data.id) {
                    if (contact.selected) {
                        selectedContacts++;
                    }
                    return data;
                } else {
                    return contact;
                }
            }
        );
        this.setState({
            selectedContacts: selectedContacts,
            contactList: contactList
        });

    };


    onAddContact = () => {
        this.setState({addContactState: true});
    };
    onContactClose = () => {
        this.setState({addContactState: false});
    };
    onFilterOptionSelect = (option) => {
        switch (option.name) {
            case 'All contacts': {
                this.setState({
                    selectedSectionId: option.id,
                    filterOption: option.name,
                    contactList: this.state.allContact
                });
                break;
            }
            case 'Frequently contacted': {
                this.setState({
                    selectedSectionId: option.id,
                    filterOption: option.name,
                    contactList: this.state.allContact.filter((contact) => contact.frequently)
                });
                break;
            }
            case 'Starred contacts': {
                this.setState({
                    selectedSectionId: option.id,
                    filterOption: option.name,
                    contactList: this.state.allContact.filter((contact) => contact.starred)
                });
                break;
            }
        }

    };
    onSaveContact = (data) => {
        let isNew = true;
        const contactList = this.state.allContact.map((contact) => {
            if (contact.id === data.id) {
                isNew = false;
                return data
            } else {
                return contact
            }
        });
        if (isNew) {
            contactList.push(data);
        }
        this.setState({
            alertMessage: isNew ? 'Contact Added Successfully' : 'Contact Updated Successfully',
            showMessage: true,
            contactList: contactList,
            allContact: contactList
        });
    };
    onDeleteContact = (data) => {
        this.setState({
            alertMessage: 'Contact Deleted Successfully',
            showMessage: true,
            allContact: this.state.allContact.filter((contact) => contact.id !== data.id),
            contactList: this.state.allContact.filter((contact) => contact.id !== data.id)
        })
    };
    onDeleteSelectedContact = () => {
        const contacts = this.state.allContact.filter((contact) => !contact.selected);
        this.setState({
            alertMessage: 'Contact Deleted Successfully',
            showMessage: true,
            allContact: contacts,
            contactList: contacts,
            selectedContacts: 0
        })
    };
    filterContact = (userName) => {
        const {filterOption} = this.state;
        if (userName === '') {
            this.setState({contactList: this.state.allContact});
        } else {
            const filterContact = this.state.allContact.filter((contact) =>
                contact.name.toLowerCase().indexOf(userName.toLowerCase()) > -1);
            if (filterOption === 'All contacts') {
                this.setState({contactList: filterContact});
            } else if (filterOption === 'Frequently contacted') {
                this.setState({contactList: filterContact.filter((contact) => contact.frequently)});

            } else if (filterOption === 'Starred contacts') {
                this.setState({contactList: filterContact.filter((contact) => contact.starred)});
            }
        }
    };
    handleRequestClose = () => {
        this.setState({
            showMessage: false,
        });
    };
    getAllContact = () => {
        console.log(this.state.allContact);
        let contactList = this.state.allContact.map((contact) => contact ? {
            ...contact,
            selected: true
        } : contact);
        this.setState({
            selectedContacts: contactList.length,
            allContact: contactList,
            contactList: contactList
        });
    };
    getUnselectedAllContact = () => {
        let contactList = this.state.allContact.map((contact) => contact ? {
            ...contact,
            selected: false
        } : contact);
        this.setState({
            selectedContacts: 0,
            allContact: contactList,
            contactList: contactList
        });
    };

    constructor() {
        super();
        this.state = {
            width: 1200,
            noContentFoundMessage: 'No contact found in selected folder',
            alertMessage: '',
            showMessage: false,
            selectedSectionId: 1,
            drawerState: false,
            user: {
                name: 'Robert Johnson',
                email: 'robert.johnson@example.com',
                avatar: 'http://via.placeholder.com/256x256'
            },
            searchUser: '',
            filterOption: 'All contacts',
            allContact: contactList,
            contactList: contactList,
            selectedContact: null,
            selectedContacts: 0,
            addContactState: false,
        }
    }

    componentDidMount() {
        this.manageHeight();
    }

    componentDidUpdate() {
        this.manageHeight();
    }

    manageHeight() {
        const $body = $('#body');
        window.addEventListener("resize", () => {
            if ($body.width() >= 1200) {
                if (this.state.width !== 1200) {
                    this.setState({width: 1200})
                }
            }
            else if ($body.width() >= 992) {
                if (this.state.width !== 992) {
                    this.setState({width: 992})
                }
            }
            else if ($body.width() >= 768) {
                if (this.state.width !== 768) {
                    this.setState({width: 768})
                }
            }
            else if ($body.width() >= 576) {
                if (this.state.width !== 576) {
                    this.setState({width: 576})
                }
            }
            else if ($body.width() >= 0) {
                if (this.state.width !== 0) {
                    this.setState({width: 0})
                }
            }

        });

        if ($body.width() >= 1200) {
            $('.module-list-scroll').slimscroll({
                height: 'calc(100vh - 323px)'
            });
            $('.module-side-scroll').slimscroll({
                height: 'calc(100vh - 323px)'
            });
        } else if ($body.width() >= 992) {
            $('.module-list-scroll').slimscroll({
                height: 'calc(100vh - 323px)'
            });
            $('.module-side-scroll').slimscroll({
                height: 'calc(100vh - 164px)'
            });
        } else {
            $('.module-list-scroll').slimscroll({
                height: 'calc(100vh - 288px)'
            });
            $('.module-side-scroll').slimscroll({
                height: 'calc(100vh - 164px)'
            });
        }
    }

    onAllContactSelect() {
        const selectAll = this.state.selectedContacts < this.state.contactList.length;
        if (selectAll) {
            this.getAllContact();
        } else {
            this.getUnselectedAllContact();
        }
    }

    updateContactUser(evt) {
        this.setState({
            searchUser: evt.target.value,
        });
        this.filterContact(evt.target.value)
    }

    onToggleDrawer() {
        this.setState({
            drawerState: !this.state.drawerState
        });
    }

    render() {
        const {user, contactList, addContactState, selectedContacts, alertMessage, showMessage, noContentFoundMessage} = this.state;
        return (
            <div className="app-wrapper">
                <div className="app-module animated slideInUpTiny animation-duration-3">

                    <div className="d-block d-xl-none">
                        <Drawer type="temporary"
                                open={this.state.drawerState}
                                onClose={this.onToggleDrawer.bind(this)}>
                            {this.ContactSideBar(user)}
                        </Drawer>
                    </div>
                    <div className="app-module-sidenav d-none d-xl-flex">
                        {this.ContactSideBar(user)}
                    </div>

                    <div className="module-box">
                        <div className="module-box-header">
                            <IconButton className="drawer-btn d-block d-xl-none" aria-label="Menu"
                                        onClick={this.onToggleDrawer.bind(this)}>
                                <i className="zmdi zmdi-menu"/>
                            </IconButton>
                            <SearchBox placeholder="Search contact"
                                       onChange={this.updateContactUser.bind(this)}
                                       value={this.state.searchUser}/>
                        </div>
                        <div className="module-box-content">

                            <div className="module-box-topbar">
                                <Checkbox
                                    indeterminate={selectedContacts > 0 && selectedContacts < contactList.length}
                                    checked={selectedContacts > 0}
                                    onChange={this.onAllContactSelect.bind(this)}
                                    value="SelectMail"/>


                                {selectedContacts > 0 &&
                                <IconButton
                                    onClick={this.onDeleteSelectedContact.bind(this)}>
                                    <i className="zmdi zmdi-delete"/>
                                </IconButton>}

                            </div>
                            <div className="module-list-scroll">
                                {contactList.length === 0 ?
                                    <div className="h-100 d-flex align-items-center justify-content-center">
                                        {noContentFoundMessage}
                                    </div>
                                    : <ContactList contactList={contactList}
                                                   addFavourite={this.addFavourite.bind(this)}
                                                   onContactSelect={this.onContactSelect.bind(this)}
                                                   onDeleteContact={this.onDeleteContact.bind(this)}
                                                   onSaveContact={this.onSaveContact.bind(this)}/>
                                }


                            </div>

                        </div>
                    </div>
                </div>

                <Button className="btn-fixed" variant="fab" color="primary" aria-label="add"
                        onClick={this.onAddContact}>
                    <i className="zmdi zmdi-plus"/>
                </Button>
                <AddContact open={addContactState} contact={{
                    'id': contactId++,
                    'name': '',
                    'thumb': '',
                    'email': '',
                    'phone': '',
                    'designation': '',
                    'selected': false,
                    'starred': false,
                    'frequently': false,
                }} onSaveContact={this.onSaveContact}
                            onContactClose={this.onContactClose} onDeleteContact={this.onDeleteContact}/>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={showMessage}
                    autoHideDuration={3000}
                    onClose={this.handleRequestClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{alertMessage}</span>}
                /></div>
        )
    }
}

export default Contact;