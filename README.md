# Anular Smart Table
This repo hosts the developement page of the npm package ng-smart-table-plus.

![Capture](https://user-images.githubusercontent.com/20605899/117418896-3babec00-af1c-11eb-9e51-341f187f52f9.PNG)

This component is used to display data from remote back-end or from local array.
Features are:
- search bar
- sorting on each column (can be enabled or disabled for each column)
- pagination
- custom template to display custom content in each cell
- click callback on each row


## Usage

Install the package by running <code>npm install ng-smart-table-plus</code>.
Then add an import for "SmartTableModule" in your app module.
Now you are able to use SmartTableComponent inside your app!

### Component Properties
- <b> headers: string[] </b> are the headers that will be displayed 
- <b> sortOnColumn: boolean[] </b> one flag for each column, enables or disables sorting on that column
- <b> paginationEnabled: boolean </b> whether pagination is enabled or not
- <b> searchEnabled: boolean </b> whether search is enabled or not
- <b> localArray: T[] </b> the array of data that should be represented. T is a generic type. Specify this only if you want to work with local data
- <b> paginationEnabled: boolean </b> whether pagination is enabled or not
- <b> perPageOptions: number[] </b> is an array that represent the options displayed in the "shows #N entries"
- <b> getData(requestData: RequestData<T>) : Observable<ResponseData<T>> </b> is a callback used when the table need to be configured with a backend. This callback has to parse the requestData object, compute the request data to be done to the backend, and return the observable of that request. The observable response has to be wrapped in a ResponseData object, in order to incude data such as total page numbers for the paginator.
