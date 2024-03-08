import React from "react";
import {Pagination} from "semantic-ui-react";
import {useTranslation} from "react-i18next";

const PaginationDetail = ({info, currentPage = 1, eventHandler}) => {
    const { t } = useTranslation();

    const updatePages = (evt, {activePage}) => {
        eventHandler(activePage);
    };

    return (
        <>
            { info && (
                <div className="pagination-wrapper">
                    <div className="pagination-counter">
                        <div> { t('Desde') } <b>{ info.from }</b> { t('até') }  <b>{ info.to }</b> { t('de') } <b>{ info.total }</b> { t('resultados') }</div>
                    </div>
                    <div className="pagination-list">
                        { info.last_page > 1 && (
                            <Pagination activePage={currentPage} totalPages={info.last_page} onPageChange={updatePages} firstItem={null} lastItem={null} />
                        )}
                    </div>
                </div>
                )
            }
        </>
    );
};

export default PaginationDetail;
