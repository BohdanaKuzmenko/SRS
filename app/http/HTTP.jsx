export function GET(url, returnHeaders, async=true) {
    var responseData = {};
    var asynchronous = async!= false;
    console.log("GET: " + url);
    return $.ajax({
        type: 'GET',
        url: url,
        async: asynchronous,
        success: function (response, textStatus, request) {
            if (returnHeaders == true) {
                responseData['data'] = response;
                responseData['currentPage'] = request.getResponseHeader('X-Page-Current');
                responseData['firstPageUrl'] = request.getResponseHeader('X-Link-First');
                responseData['prevPageUrl'] = request.getResponseHeader('X-Link-Prev');
                responseData['nextPageUrl'] = request.getResponseHeader('X-Link-Next');
                responseData['lastPageUrl'] = request.getResponseHeader('X-Link-Last');
                responseData['itemsCount'] = request.getResponseHeader('X-Total-Count');


            } else {
                responseData = response;
            }
            return responseData
        }
    }).then(function () {
        return responseData
    });
}

export function POST(url, data, contentType) {
    var responseData = null;
    return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        async: true,
        contentType: contentType,
        success: function (response) {
            responseData = response.data;
        }
    });

}

export function DELETE(url, data) {
    var responseData = null;
    console.log("DELETE " + url);
    $.ajax({
        type: 'DELETE',
        url: url,
        data: data,
        async: false,
        success: function (response) {
            responseData = response.data;
        }
    });
    return responseData;
}

export function PUT(url, data) {
    var responseData = null;
    console.log("PUT " + url);
    return $.ajax({
        type: 'PUT',
        url: url,
        data: data,
        contentType: "application/json; charset=utf-8",
        async: true,
        success: function (response) {
            responseData = response.data;
        }
    });

}


export function PATCH(url, data) {
    var responseData = null;
    console.log("PATCH " + url);
    return $.ajax({
        type: 'PATCH',
        url: url,
        data: data,
        async: true,
        processData: false,
        contentType: 'application/json',
        success: function (response) {
            responseData = response.data;
        }
    });
}


