/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.73913043478261, "KoPercent": 1.2608695652173914};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43869565217391304, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "AppointmentSummary-6"], "isController": false}, {"data": [0.73, 500, 1500, "AppointmentSummary-7"], "isController": false}, {"data": [0.75, 500, 1500, "AppointmentSummary-8"], "isController": false}, {"data": [0.35, 500, 1500, "AppointmentSummary-9"], "isController": false}, {"data": [0.12, 500, 1500, "Logout-10"], "isController": false}, {"data": [0.07, 500, 1500, "Login-0"], "isController": false}, {"data": [0.41, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.02, 500, 1500, "Login-1"], "isController": false}, {"data": [0.48, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.09, 500, 1500, "Login-2"], "isController": false}, {"data": [0.82, 500, 1500, "Authenticate-8"], "isController": false}, {"data": [0.37, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.36, 500, 1500, "Login-3"], "isController": false}, {"data": [0.82, 500, 1500, "Authenticate-9"], "isController": false}, {"data": [0.07, 500, 1500, "Login-4"], "isController": false}, {"data": [0.34, 500, 1500, "Logout-6"], "isController": false}, {"data": [0.03, 500, 1500, "Login-5"], "isController": false}, {"data": [0.4, 500, 1500, "Logout-5"], "isController": false}, {"data": [0.02, 500, 1500, "Login-6"], "isController": false}, {"data": [0.5, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.03, 500, 1500, "Login-7"], "isController": false}, {"data": [0.4, 500, 1500, "Authenticate-10"], "isController": false}, {"data": [0.4, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.03, 500, 1500, "Login-8"], "isController": false}, {"data": [0.0, 500, 1500, "Authenticate"], "isController": false}, {"data": [0.16, 500, 1500, "Login-9"], "isController": false}, {"data": [0.25, 500, 1500, "Logout-9"], "isController": false}, {"data": [0.26, 500, 1500, "Logout-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.39, 500, 1500, "Logout-7"], "isController": false}, {"data": [0.53, 500, 1500, "AppointmentSummary-0"], "isController": false}, {"data": [0.76, 500, 1500, "AppointmentSummary-1"], "isController": false}, {"data": [0.75, 500, 1500, "AppointmentSummary-2"], "isController": false}, {"data": [0.82, 500, 1500, "AppointmentSummary-3"], "isController": false}, {"data": [0.75, 500, 1500, "AppointmentSummary-4"], "isController": false}, {"data": [0.75, 500, 1500, "AppointmentSummary-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.73, 500, 1500, "Authenticate-6"], "isController": false}, {"data": [0.84, 500, 1500, "Authenticate-7"], "isController": false}, {"data": [0.84, 500, 1500, "Authenticate-4"], "isController": false}, {"data": [0.82, 500, 1500, "Authenticate-5"], "isController": false}, {"data": [0.84, 500, 1500, "Authenticate-2"], "isController": false}, {"data": [0.84, 500, 1500, "Authenticate-3"], "isController": false}, {"data": [0.77, 500, 1500, "Authenticate-0"], "isController": false}, {"data": [0.7, 500, 1500, "Authenticate-1"], "isController": false}, {"data": [0.02, 500, 1500, "AppointmentSummary"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2300, 29, 1.2608695652173914, 3564.236521739135, 72, 54937, 1238.5, 11745.5, 17778.699999999997, 26214.07999999998, 15.90924811509995, 302.477038588573, 18.15097141523138], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AppointmentSummary-6", 50, 0, 0.0, 780.7199999999999, 85, 3603, 135.0, 2874.7, 3323.0499999999993, 3603.0, 0.7387706855791962, 0.6624118092494089, 0.48481826241134746], "isController": false}, {"data": ["AppointmentSummary-7", 50, 0, 0.0, 1092.1200000000001, 99, 4885, 278.0, 3537.7, 4177.699999999996, 4885.0, 0.7343545757633616, 0.6579358027229867, 0.49267733745061465], "isController": false}, {"data": ["AppointmentSummary-8", 50, 1, 2.0, 1003.2799999999997, 95, 4961, 283.0, 3649.3999999999996, 4257.699999999996, 4961.0, 0.7315824127587972, 0.6780425826688127, 0.490803208903358], "isController": false}, {"data": ["AppointmentSummary-9", 50, 0, 0.0, 2664.36, 278, 10504, 1148.5, 7701.4, 9225.749999999995, 10504.0, 0.7189589474441009, 0.16569756991875764, 0.49849692645049964], "isController": false}, {"data": ["Logout-10", 50, 1, 2.0, 3608.399999999999, 274, 8699, 3367.0, 7121.799999999999, 8155.499999999996, 8699.0, 0.6516271129009136, 0.1890991336617534, 0.4122177843700721], "isController": false}, {"data": ["Login-0", 50, 0, 0.0, 5891.780000000002, 1098, 29079, 4331.5, 13763.399999999998, 22024.699999999983, 29079.0, 1.5636238546455266, 11.64777613597273, 0.7986086679488382], "isController": false}, {"data": ["Logout-2", 50, 0, 0.0, 1659.5999999999997, 258, 6543, 914.5, 3382.0, 3906.549999999998, 6543.0, 0.6656548712623479, 0.5981273048299917, 0.41668434812418453], "isController": false}, {"data": ["Login-1", 50, 0, 0.0, 12486.56, 642, 26803, 13972.5, 19238.5, 21048.5, 26803.0, 1.485001485001485, 177.23457918770418, 0.8063094000594], "isController": false}, {"data": ["Logout-1", 50, 0, 0.0, 1157.8399999999997, 269, 5439, 1050.5, 1760.8, 2506.8999999999974, 5439.0, 0.6660095372565735, 2.950864522004955, 0.36682556544209716], "isController": false}, {"data": ["Login-2", 50, 1, 2.0, 8807.279999999999, 352, 24345, 7969.5, 18780.5, 22178.999999999993, 24345.0, 1.5991812192157615, 25.737666064974736, 0.8723658486854731], "isController": false}, {"data": ["Authenticate-8", 50, 0, 0.0, 808.1599999999997, 72, 7341, 271.5, 2365.2999999999997, 4735.949999999998, 7341.0, 1.7382235355466713, 2.818739950895185, 1.1633196810359812], "isController": false}, {"data": ["Logout-0", 50, 0, 0.0, 1948.6800000000003, 308, 7410, 1194.5, 5256.5, 5489.7, 7410.0, 0.6606590734917153, 0.2167787584894691, 0.3793628273565709], "isController": false}, {"data": ["Login-3", 50, 0, 0.0, 1846.9199999999998, 415, 10865, 1081.0, 1787.1999999999998, 10245.649999999998, 10865.0, 1.5809776765952064, 5.348151046607222, 0.8908438665971036], "isController": false}, {"data": ["Authenticate-9", 50, 0, 0.0, 812.3599999999997, 233, 4927, 269.0, 3309.8999999999987, 4512.4, 4927.0, 1.741189580721549, 1.558636735617774, 1.1919666953962946], "isController": false}, {"data": ["Login-4", 50, 1, 2.0, 9453.1, 391, 25064, 9252.5, 18497.7, 19868.24999999999, 25064.0, 1.566072603125881, 48.01138143264322, 0.8303243532120149], "isController": false}, {"data": ["Logout-6", 50, 0, 0.0, 2234.1599999999994, 251, 5624, 1516.5, 5007.4, 5506.799999999999, 5624.0, 0.6626553926895856, 9.1030990321918, 0.4005700078855992], "isController": false}, {"data": ["Login-5", 50, 5, 10.0, 8974.519999999997, 659, 26238, 7200.5, 18281.2, 18753.299999999996, 26238.0, 1.5193873830071714, 19.179505885726876, 0.7598420691777075], "isController": false}, {"data": ["Logout-5", 50, 0, 0.0, 1619.0600000000002, 252, 3704, 920.5, 3509.6, 3614.1499999999996, 3704.0, 0.6655219688801928, 0.5963310813733711, 0.4146513829546513], "isController": false}, {"data": ["Login-6", 50, 1, 2.0, 11827.879999999997, 653, 28299, 12592.0, 20076.5, 23154.549999999985, 28299.0, 1.4469267276305127, 134.39939993235618, 0.74499770300382], "isController": false}, {"data": ["Logout-4", 50, 0, 0.0, 975.0400000000003, 263, 3325, 929.0, 1604.6, 1739.8999999999999, 3325.0, 0.6630244523418024, 0.15280641675064977, 0.4292824334986474], "isController": false}, {"data": ["Login-7", 50, 1, 2.0, 9681.659999999998, 452, 20582, 10332.0, 17681.0, 20050.25, 20582.0, 1.6093729882837646, 58.68342853780417, 0.8532820144521694], "isController": false}, {"data": ["Authenticate-10", 50, 0, 0.0, 2688.1600000000008, 267, 46197, 1127.5, 4913.5, 8122.149999999994, 46197.0, 1.052853232259423, 0.24264976837228888, 0.7300056590861234], "isController": false}, {"data": ["Logout-3", 50, 0, 0.0, 1707.9400000000005, 241, 6542, 913.5, 3584.7999999999997, 3900.899999999998, 6542.0, 0.6655574043261231, 0.5974677620632279, 0.42507279534109815], "isController": false}, {"data": ["Login-8", 50, 0, 0.0, 7569.2, 385, 21495, 5843.5, 16971.899999999998, 17969.049999999996, 21495.0, 1.6135798883402717, 55.43702676727337, 0.8950325943137445], "isController": false}, {"data": ["Authenticate", 50, 0, 0.0, 5411.259999999999, 1738, 54937, 2035.5, 14423.9, 17559.3, 54937.0, 0.8875792164450677, 27.862134400573378, 6.524019280439529], "isController": false}, {"data": ["Login-9", 50, 0, 0.0, 3191.8199999999997, 857, 27478, 1738.5, 6629.0999999999985, 11356.449999999977, 27478.0, 1.5021330289010395, 2.722616114883134, 0.8434829019707984], "isController": false}, {"data": ["Logout-9", 50, 4, 8.0, 1986.22, 193, 4600, 2058.0, 3623.7999999999997, 4344.949999999999, 4600.0, 0.6585446163977609, 0.6809762923938097, 0.3857630885742509], "isController": false}, {"data": ["Logout-8", 50, 0, 0.0, 2087.3000000000006, 262, 5242, 2237.5, 3686.7999999999997, 4454.749999999996, 5242.0, 0.6581372084452166, 0.5899325985231402, 0.41005033104301586], "isController": false}, {"data": ["Logout", 50, 5, 10.0, 8352.68, 2102, 18921, 7750.5, 15066.599999999999, 16225.299999999997, 18921.0, 0.6380317995048874, 15.65511958709772, 4.284047071593548], "isController": false}, {"data": ["Logout-7", 50, 0, 0.0, 1608.36, 249, 3709, 1211.5, 3306.9, 3637.1999999999994, 3709.0, 0.6655574043261231, 0.5970777870216306, 0.40492408485856907], "isController": false}, {"data": ["AppointmentSummary-0", 50, 0, 0.0, 2214.8199999999997, 276, 14222, 1118.0, 6508.399999999998, 10395.299999999988, 14222.0, 0.7560864962951762, 5.049683152502647, 0.5681724207999396], "isController": false}, {"data": ["AppointmentSummary-1", 50, 0, 0.0, 744.5400000000001, 80, 3594, 126.5, 2878.1, 3332.8, 3594.0, 0.7383670274820208, 0.6634198899463946, 0.4975324696900335], "isController": false}, {"data": ["AppointmentSummary-2", 50, 0, 0.0, 781.6000000000001, 90, 3581, 125.0, 2890.0, 3309.7499999999995, 3581.0, 0.7388798581350673, 0.6628127539899512, 0.5072583401063987], "isController": false}, {"data": ["AppointmentSummary-3", 50, 0, 0.0, 573.62, 262, 2750, 285.5, 1584.3999999999999, 1775.35, 2750.0, 0.748547817234565, 0.17251687975327862, 0.5204746541709084], "isController": false}, {"data": ["AppointmentSummary-4", 50, 0, 0.0, 782.54, 76, 3594, 131.0, 2866.2999999999997, 3312.5, 3594.0, 0.7388689394275243, 0.662240149029865, 0.4957060169792082], "isController": false}, {"data": ["AppointmentSummary-5", 50, 0, 0.0, 1173.4, 157, 6602, 305.0, 5049.799999999999, 5252.95, 6602.0, 0.7335357892111556, 10.076804635579421, 0.4785174874932148], "isController": false}, {"data": ["Login", 50, 8, 16.0, 22517.140000000007, 5432, 34309, 25058.5, 30886.4, 32484.149999999998, 34309.0, 1.3916722333556, 494.1482085264279, 7.451399108981853], "isController": false}, {"data": ["Authenticate-6", 50, 0, 0.0, 1210.5599999999997, 164, 7834, 424.0, 4516.0999999999985, 7031.699999999998, 7834.0, 1.6112400103119362, 22.13409494634571, 1.0432149676140758], "isController": false}, {"data": ["Authenticate-7", 50, 0, 0.0, 382.9, 77, 2539, 107.0, 1577.8999999999999, 2026.9499999999987, 2539.0, 1.615717701803141, 4.4814707474310085, 1.0576323979674271], "isController": false}, {"data": ["Authenticate-4", 50, 0, 0.0, 560.9599999999999, 251, 2555, 282.5, 1766.8, 2492.6, 2555.0, 1.6066321776292536, 0.37027850968799203, 1.1171114360078405], "isController": false}, {"data": ["Authenticate-5", 50, 0, 0.0, 428.34, 83, 3521, 107.0, 1585.1, 2087.1999999999966, 3521.0, 1.6158743496105743, 2.4302497737775908, 1.081436532495233], "isController": false}, {"data": ["Authenticate-2", 50, 0, 0.0, 653.58, 77, 11920, 105.5, 1572.3999999999999, 3862.8499999999785, 11920.0, 1.6153001227628092, 1.4501419949764165, 1.0884346530335336], "isController": false}, {"data": ["Authenticate-3", 50, 0, 0.0, 509.62, 80, 6687, 108.0, 1566.0, 3004.9999999999905, 6687.0, 1.615717701803141, 1.9490225917727653, 1.1065772838169714], "isController": false}, {"data": ["Authenticate-0", 50, 0, 0.0, 622.0799999999998, 246, 2485, 285.5, 1770.3, 1785.45, 2485.0, 1.3948557719131842, 0.47743842583551865, 0.9398930494336887], "isController": false}, {"data": ["Authenticate-1", 50, 0, 0.0, 1214.1799999999998, 269, 14585, 300.5, 2312.999999999999, 7044.94999999999, 14585.0, 1.4422938240978451, 11.469334579715579, 0.8711511037153489], "isController": false}, {"data": ["AppointmentSummary", 50, 1, 2.0, 5648.580000000001, 1487, 23444, 2333.5, 17849.9, 20184.449999999986, 23444.0, 0.7148576003660071, 18.792307841809162, 4.8765854201218115], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 3, 10.344827586206897, 0.13043478260869565], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 3, 10.344827586206897, 0.13043478260869565], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, 10.344827586206897, 0.13043478260869565], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, 20.689655172413794, 0.2608695652173913], "isController": false}, {"data": ["Assertion failed", 14, 48.275862068965516, 0.6086956521739131], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2300, 29, "Assertion failed", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AppointmentSummary-8", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-10", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 50, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-4", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-5", 50, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-6", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-7", 50, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout-9", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Logout", 50, 5, "Assertion failed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 50, 8, "Assertion failed", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["AppointmentSummary", 50, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
