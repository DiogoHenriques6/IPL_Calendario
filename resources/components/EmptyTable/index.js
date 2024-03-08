import React from 'react';
import {Header, Icon, Loader} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const EmptyTable = ({label, isLoading = false}) => {
    const { t } = useTranslation();
    return (
        <div key="empty-table">
            <div className={"empty-table-row"}>
                <div className='empty-table-row-content'>
                    <Header as='h2' className={"margin-y-l"}>{(isLoading ? t("A carregar registos...") : label) }</Header>
                    <div className={"margin-bottom-xl"}>
                        { (isLoading ? (
                                <Loader active inline='centered'  />
                            ) : (
                                <Icon.Group size='huge'>
                                    <Icon size='large' color='grey' name='clipboard outline' className={"margin-none"}/>
                                    <Icon size='tiny' color='grey' name='cogs' />
                                </Icon.Group>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmptyTable;
