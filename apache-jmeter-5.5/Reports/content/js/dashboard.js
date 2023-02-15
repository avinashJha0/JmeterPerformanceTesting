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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6630434782608695, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AppointmentSummary-6"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-7"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-8"], "isController": false}, {"data": [0.5, 500, 1500, "AppointmentSummary-9"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-10"], "isController": false}, {"data": [0.25, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-2"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.25, 500, 1500, "Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-8"], "isController": false}, {"data": [0.25, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-9"], "isController": false}, {"data": [0.25, 500, 1500, "Login-4"], "isController": false}, {"data": [0.5, 500, 1500, "Logout-6"], "isController": false}, {"data": [0.25, 500, 1500, "Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login-6"], "isController": false}, {"data": [0.75, 500, 1500, "Logout-4"], "isController": false}, {"data": [0.0, 500, 1500, "Login-7"], "isController": false}, {"data": [0.5, 500, 1500, "Authenticate-10"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-3"], "isController": false}, {"data": [0.0, 500, 1500, "Login-8"], "isController": false}, {"data": [0.25, 500, 1500, "Authenticate"], "isController": false}, {"data": [0.25, 500, 1500, "Login-9"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-9"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-8"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-7"], "isController": false}, {"data": [0.75, 500, 1500, "AppointmentSummary-0"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-1"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-2"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-3"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-4"], "isController": false}, {"data": [1.0, 500, 1500, "AppointmentSummary-5"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-6"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-7"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-4"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-5"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-2"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-3"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-0"], "isController": false}, {"data": [1.0, 500, 1500, "Authenticate-1"], "isController": false}, {"data": [0.25, 500, 1500, "AppointmentSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 0, 0.0, 1184.7717391304343, 82, 7551, 387.0, 4213.0, 4717.099999999996, 7551.0, 1.005629338142865, 19.15311424003935, 1.1555429168716183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AppointmentSummary-6", 2, 0, 0.0, 136.5, 133, 140, 136.5, 140.0, 140.0, 140.0, 0.1632786349906115, 0.14685510041636052, 0.10715160421258878], "isController": false}, {"data": ["AppointmentSummary-7", 2, 0, 0.0, 128.5, 109, 148, 128.5, 148.0, 148.0, 148.0, 0.1635322976287817, 0.14660414963205232, 0.10971356295993458], "isController": false}, {"data": ["AppointmentSummary-8", 2, 0, 0.0, 119.5, 104, 135, 119.5, 135.0, 135.0, 135.0, 0.16358580075249468, 0.1466521143464747, 0.111985982741698], "isController": false}, {"data": ["AppointmentSummary-9", 2, 0, 0.0, 926.5, 352, 1501, 926.5, 1501.0, 1501.0, 1501.0, 0.14682131845543972, 0.03383772573777712, 0.10179993760093965], "isController": false}, {"data": ["Logout-10", 2, 0, 0.0, 1576.5, 1510, 1643, 1576.5, 1643.0, 1643.0, 1643.0, 0.10788068396353633, 0.02486312638222126, 0.06963782431630616], "isController": false}, {"data": ["Login-0", 2, 0, 0.0, 1569.5, 1452, 1687, 1569.5, 1687.0, 1687.0, 1687.0, 1.0245901639344264, 7.632396260245902, 0.5233014216188525], "isController": false}, {"data": ["Logout-2", 2, 0, 0.0, 276.5, 259, 294, 276.5, 294.0, 294.0, 294.0, 0.11552680221811461, 0.1036807922250462, 0.07231707052911275], "isController": false}, {"data": ["Login-1", 2, 0, 0.0, 4103.5, 3887, 4320, 4103.5, 4320.0, 4320.0, 4320.0, 0.4362050163576881, 52.0596203653217, 0.23684569247546347], "isController": false}, {"data": ["Logout-1", 2, 0, 0.0, 388.5, 379, 398, 388.5, 398.0, 398.0, 398.0, 0.11496234983043054, 0.5093595519342415, 0.06331910674254182], "isController": false}, {"data": ["Login-2", 2, 0, 0.0, 1781.5, 815, 2748, 1781.5, 2748.0, 2748.0, 2748.0, 0.6637902422834384, 10.854655866246267, 0.3694926153335546], "isController": false}, {"data": ["Authenticate-8", 2, 0, 0.0, 321.5, 291, 352, 321.5, 352.0, 352.0, 352.0, 0.4893564962074871, 0.43917833985808663, 0.3283085086860778], "isController": false}, {"data": ["Logout-0", 2, 0, 0.0, 1370.5, 607, 2134, 1370.5, 2134.0, 2134.0, 2134.0, 0.10453143782992735, 0.034299378037944916, 0.0600239115664036], "isController": false}, {"data": ["Login-3", 2, 0, 0.0, 940.5, 643, 1238, 940.5, 1238.0, 1238.0, 1238.0, 1.3306719893546242, 4.5014138389886895, 0.7498024783765802], "isController": false}, {"data": ["Authenticate-9", 2, 0, 0.0, 165.5, 101, 230, 165.5, 230.0, 230.0, 230.0, 0.49664762850757393, 0.4454793425627018, 0.33999022224981373], "isController": false}, {"data": ["Login-4", 2, 0, 0.0, 2511.0, 606, 4416, 2511.0, 4416.0, 4416.0, 4416.0, 0.4272591326639607, 13.345589217047639, 0.23115386669515062], "isController": false}, {"data": ["Logout-6", 2, 0, 0.0, 563.5, 549, 578, 563.5, 578.0, 578.0, 578.0, 0.11365573677331363, 1.5613234855373075, 0.06870400494402454], "isController": false}, {"data": ["Login-5", 2, 0, 0.0, 2189.5, 587, 3792, 2189.5, 3792.0, 3792.0, 3792.0, 0.49297510475720974, 6.772149217402021, 0.27392854942075423], "isController": false}, {"data": ["Logout-5", 2, 0, 0.0, 313.5, 308, 319, 313.5, 319.0, 319.0, 319.0, 0.1154334526145677, 0.10303337469698719, 0.07192045192196699], "isController": false}, {"data": ["Login-6", 2, 0, 0.0, 4268.0, 4143, 4393, 4268.0, 4393.0, 4393.0, 4393.0, 0.4537205081669691, 42.98381493874773, 0.2383805013611615], "isController": false}, {"data": ["Logout-4", 2, 0, 0.0, 461.0, 381, 541, 461.0, 541.0, 541.0, 541.0, 0.11494913500775907, 0.02649218345881947, 0.07442507471693775], "isController": false}, {"data": ["Login-7", 2, 0, 0.0, 4455.0, 3747, 5163, 4455.0, 5163.0, 5163.0, 5163.0, 0.38737168312996323, 14.396305442572148, 0.209574133255859], "isController": false}, {"data": ["Authenticate-10", 2, 0, 0.0, 1058.0, 377, 1739, 1058.0, 1739.0, 1739.0, 1739.0, 0.3604902667627974, 0.08308174116798846, 0.24994930605623647], "isController": false}, {"data": ["Logout-3", 2, 0, 0.0, 308.0, 286, 330, 308.0, 330.0, 330.0, 330.0, 0.11528706479133041, 0.10380339232188149, 0.07363060583352549], "isController": false}, {"data": ["Login-8", 2, 0, 0.0, 3548.0, 1840, 5256, 3548.0, 5256.0, 5256.0, 5256.0, 0.380517503805175, 13.075458404680365, 0.211068302891933], "isController": false}, {"data": ["Authenticate", 2, 0, 0.0, 1990.5, 1316, 2665, 1990.5, 2665.0, 2665.0, 2665.0, 0.3083089255433945, 8.594412382457222, 2.269713706258671], "isController": false}, {"data": ["Login-9", 2, 0, 0.0, 2411.0, 579, 4243, 2411.0, 4243.0, 4243.0, 4243.0, 0.4713646005185011, 0.8543483384397831, 0.264682270798963], "isController": false}, {"data": ["Logout-9", 2, 0, 0.0, 415.5, 370, 461, 415.5, 461.0, 461.0, 461.0, 0.11487650775416428, 0.10309717834577829, 0.07314402642159679], "isController": false}, {"data": ["Logout-8", 2, 0, 0.0, 278.5, 109, 448, 278.5, 448.0, 448.0, 448.0, 0.1142791840466259, 0.10267270441689046, 0.07120128849780012], "isController": false}, {"data": ["Logout", 2, 0, 0.0, 3662.0, 2847, 4477, 3662.0, 4477.0, 4477.0, 4477.0, 0.09357600711177654, 2.2776253918495297, 0.6342881497683993], "isController": false}, {"data": ["Logout-7", 2, 0, 0.0, 345.5, 338, 353, 345.5, 353.0, 353.0, 353.0, 0.11513441943469, 0.10321620804789593, 0.07004760088653504], "isController": false}, {"data": ["AppointmentSummary-0", 2, 0, 0.0, 519.5, 412, 627, 519.5, 627.0, 627.0, 627.0, 0.15696123057604772, 1.0482986874117093, 0.11795084660963741], "isController": false}, {"data": ["AppointmentSummary-1", 2, 0, 0.0, 145.5, 128, 163, 145.5, 163.0, 163.0, 163.0, 0.16287971333170453, 0.14697349132665527, 0.10975293183483997], "isController": false}, {"data": ["AppointmentSummary-2", 2, 0, 0.0, 116.5, 112, 121, 116.5, 121.0, 121.0, 121.0, 0.16343875132793984, 0.14556263790144644, 0.11220453338236495], "isController": false}, {"data": ["AppointmentSummary-3", 2, 0, 0.0, 383.5, 381, 386, 383.5, 386.0, 386.0, 386.0, 0.15997440409534475, 0.03686910094384898, 0.11123220284754438], "isController": false}, {"data": ["AppointmentSummary-4", 2, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 0.16350555918901244, 0.14689952583387836, 0.10969562418247221], "isController": false}, {"data": ["AppointmentSummary-5", 2, 0, 0.0, 231.0, 211, 251, 231.0, 251.0, 251.0, 251.0, 0.1622454774073173, 2.228815557313215, 0.10583982315242962], "isController": false}, {"data": ["Login", 2, 0, 0.0, 6995.0, 6439, 7551, 6995.0, 7551.0, 7551.0, 7551.0, 0.26486558071778576, 95.2401275493312, 1.4443451198516752], "isController": false}, {"data": ["Authenticate-6", 2, 0, 0.0, 191.0, 170, 212, 191.0, 212.0, 212.0, 212.0, 0.5016302984700275, 6.891048250564334, 0.327235390017557], "isController": false}, {"data": ["Authenticate-7", 2, 0, 0.0, 98.0, 94, 102, 98.0, 102.0, 102.0, 102.0, 0.5113781641523907, 0.45894192661723343, 0.3355919202250064], "isController": false}, {"data": ["Authenticate-4", 2, 0, 0.0, 373.0, 358, 388, 373.0, 388.0, 388.0, 388.0, 0.47904191616766467, 0.11040419161676647, 0.33308383233532934], "isController": false}, {"data": ["Authenticate-5", 2, 0, 0.0, 98.5, 82, 115, 98.5, 115.0, 115.0, 115.0, 0.5129520389843549, 0.4613562772505771, 0.34413872146704283], "isController": false}, {"data": ["Authenticate-2", 2, 0, 0.0, 127.5, 123, 132, 127.5, 132.0, 132.0, 132.0, 0.5076142131979696, 0.4555639276649746, 0.34204473350253806], "isController": false}, {"data": ["Authenticate-3", 2, 0, 0.0, 137.5, 125, 150, 137.5, 150.0, 150.0, 150.0, 0.5073566717402334, 0.45384639776763064, 0.34831224632166413], "isController": false}, {"data": ["Authenticate-0", 2, 0, 0.0, 416.5, 408, 425, 416.5, 425.0, 425.0, 425.0, 0.4709206498704968, 0.16118914822227456, 0.3173195785260184], "isController": false}, {"data": ["Authenticate-1", 2, 0, 0.0, 387.0, 376, 398, 387.0, 398.0, 398.0, 398.0, 0.47449584816132856, 3.7732614175563466, 0.2865973457888494], "isController": false}, {"data": ["AppointmentSummary", 2, 0, 0.0, 1580.0, 1110, 2050, 1580.0, 2050.0, 2050.0, 2050.0, 0.13908205841446455, 3.652398078929068, 0.9506883475312934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
