        // For each country, use the latest value for current population
        var codes="GL,SH,BU,LK,AS,DK,FO,GU,MP,UM,US,VI,CA,ST,JP,CV,DM,SC,NZ,YE,JM,WS,OM,IN,VC,BD,SB,LC,FR,NR,NO,FM,KN,CN,BH,TO,FI,ID,MU,SE,TT,SW,BR,BS,PW,EC,AU,TV,MH,CL,KI,PH,GD,EE,AG,ES,BB,IT,MT,MV,SP,PG,VU,SG,GB,CY,GR,KM,FJ,RU,VA,SM,AM,AZ,LS,TJ,ML,DZ,TW,UZ,TZ,AR,SA,NL,AE,CH,PT,MY,PA,TR,IR,HT,DO,GW,HR,TH,MX,KW,DE,GQ,CNM,NC,IE,KZ,GE,PL,LT,UG,CD,MK,AL,NG,CM,BJ,TL,TM,KH,PE,MW,MN,AO,MZ,ZA,CR,SV,BZ,CO,KP,KR,GY,HN,GA,NI,ET,SD,SO,GH,CI,SI,GT,BA,JO,SY,WE,IL,EG,ZM,MC,UY,RW,BO,CG,EH,RS,ME,TG,MM,LA,AF,JK,PK,BG,UA,RO,QA,LI,AT,SK,SZ,HU,LY,NE,LU,AD,LR,SL,BN,MR,BE,IQ,GM,MA,TD,KV,LB,SX,DJ,ER,BI,SN,GN,ZW,PY,BY,LV,BT,NA,BF,SS,CF,MD,GZ,KE,BW,CZ,PR,TN,CU,VN,MG,VE,IS,NP,SR,KG";

        var dropdown_no=15;

        var z=0;

        var animation_speed=100;
        var offset=1;

        var code_to_country_dict = {};

        var data = [{
            name: 'Unvisited',
            data: codes.split(",").map(function (code) {
                return { code: code };
            })
        }
        , {
            name: 'Visited',
            data: [].map(function (code) {
                return { code: code };
            })
        }]

        function initial() {
          // console.log(data);
          var dropdownbuttonscontainer=document.getElementById("dropdownbuttonscontainer");
          var html_string="";
          var keys=Object.keys(code_to_country_dict).sort();
          for (var i = 0; i < keys.length; i++) {
            var dict_ind=keys[i];
            // console.log(dict_ind);
            html_string+="<div class=container><button onclick=addcountry('"+dict_ind+"') "+"id="+dict_ind;
            if (i>dropdown_no) {
              html_string+=" style='display:none;'"
            }
            html_string+=">"
            if (code_to_country_dict[dict_ind][1]==0){
              html_string+="&#10007 ";
            }
            else {
              html_string+="&#10004 "
            }
            html_string+=String(dict_ind)+" ("+code_to_country_dict[dict_ind][0]+")";
            html_string+="</button></div>"
          }
          dropdownbuttonscontainer.innerHTML=html_string;
        }

        window.onload=initial;


        const plot=()=> {
        mapChart = new Highcharts.mapChart('container', {
            chart: {
                map: 'custom/world-palestine-highres',
                spacingBottom: 20,
            },

            title: {
                text: 'Scratch Map'
            },

            subtitle: {
                text: 'Click to change the visited status of a region'
            },

            mapNavigation: {
                enabled: true,
                enableDoubleClickZoomTo: true,
                buttonOptions: {
                    verticalAlign: 'middle'
                }
            },

            legend: {
                enabled: true
            },

            plotOptions: {
                map: {
                    allowPointSelect: true,
                    allAreas: false,
                    joinBy: ['iso-a2', 'code'],
                    dataLabels: {
                        enabled: false,
                    },
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '{point.name}: <b>{series.name}</b>',
                    },
                    states: {
                            hover: {
                                color: '#a4edba'
                            }
                        },
                }
            },
            series: data});


            // console.log(mapChart.series)
            // for (var key in mapChart.series[0].mapMap) {
            //     code_to_country_dict[key]=[mapChart.series[0].mapMap[key].name, 0]
            // }
            for (var key in mapChart.series[1].mapMap) {
                code_to_country_dict[key]=[mapChart.series[1].mapMap[key].name, 0];
            }
            // console.log(code_to_country_dict);


          return mapChart;
      }

      mapChart=plot();
      mapChart.setSize(0.85*window.innerWidth, 0.85*window.innerHeight, true);


      function pointClick(a,b) {

        // console.log(mapChart.series[0].mapMap);
        //
        // for (var key in mapChart.series[0].mapMap) {
        //     // check if the property/key is defined in the object itself, not in parent
        //     if (mapChart.series[0].mapMap.hasOwnProperty(key)) {
        //         console.log(key, mapChart.series[0].mapMap[key].name);
        //     }
        // }


        // console.log(mapChart.series[0]);


        changedropdownstatus(data[a].data[b].code, a);
        if (a==1) {
          // console.log("undo visit");
          code_to_country_dict[data[a].data[b].code][1]=Math.abs(a-1);
          data[0].data.push({code: data[a].data[b].code});
          data[a].data.splice(b,1);
        }
        else {
          // console.log("new visit");
          code_to_country_dict[data[a].data[b].code][1]=Math.abs(a-1);
          data[1].data.push({code: data[a].data[b].code});
          data[a].data.splice(b,1);
        }

        // console.log(data);

        // console.log(code_to_country_dict);

        //should export to new csv probably too.

        //updates everything, is dumb. Only update the two arrays being changed, and we can just update one entry anyway.
        mapChart.series[0].setData(data[0].data, false);
        mapChart.series[1].setData(data[1].data, true);
        // mapChart.series[2].setData(data[2].data, false);
        // mapChart.series[3].setData(data[3].data, true);

        //mapChart=plot();
        //mapChart.setSize(0.95*window.innerWidth, 0.95*window.innerHeight, false);

        // document.querySelector('dialog').setAttribute('open', true);

        // let isBoss = confirm("Are you the boss?");
        //
        // alert( isBoss ); // true if OK is pressed
      }

        // Wrap point.select to get to the total selected points
        Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            var points = mapChart.getSelectedPoints();

            //probably want a pop-up asking mark as visited or not
            // console.log(data.filter(((x) => { return x.code3==points[0].code3; })));
            i=1
            j=data[1].data.findIndex((x) => { return x.code==points[0].code; })
            while (j==-1) {
              i-=1;
              j=data[i].data.findIndex((x) => { return x.code==points[0].code; })
            }

            pointClick(i,j);

            // index=data.findIndex((x) => { return x.code3==points[0].code3; });
            // pointClick(index);

            // console.log("clicked "+points[0].name);

            //need to redraw map each time
        });


        function myFunction() {
          document.getElementById("myDropdown").classList.toggle("show");
        }

        function addcountry(index) {
          // console.log(index);

          i=1
          j=data[1].data.findIndex((x) => { return x.code==index; })
          while (j==-1) {
            i-=1;
            j=data[i].data.findIndex((x) => { return x.code==index; })
          }

          pointClick(i,j);
        }

        function changedropdownstatus(index, visited) {
            var button=document.getElementById(index);

            // console.log(button.textContent[0]);
            // console.log(button.outerHTML);
            // console.log(button.outerHTML.split(button.innerHTML));

            var sp=button.outerHTML.split(button.innerHTML);
            if (visited==1) {
              // console.log("undo visit");
              button.outerHTML=sp[0]+"&#10007"+button.textContent.substr(1)+sp[1];
            }
            else {
              // console.log("new visit");
              button.outerHTML=sp[0]+"&#10004"+button.textContent.substr(1)+sp[1];
            }
        }

        function filterFunction() {
          var input, filter, ul, li, a, i;
          input = document.getElementById("myInput");
          filter = input.value.toUpperCase();
          div = document.getElementById("myDropdown");
          a = div.getElementsByTagName("button");
          var j=0;
          for (i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              if (j>dropdown_no) {
                a[i].style.display = "none";
              }
              else {
              a[i].style.display = "";
            }
              j++;
            } else {
              a[i].style.display = "none";
            }
          }
        }

        var countries_with_dates={};

        function SetData() {
          if (confirm("Ensure you have all of the desired regions selected. Press cancel and add them if you do not.")) {
            var countries_to_animate=data[1].data;
            countries_with_dates = {};
            for (i = 0; i < countries_to_animate.length; i++) {
              inp=prompt("When were you in "+countries_to_animate[i].code+" ("+code_to_country_dict[countries_to_animate[i].code][0]+")? Enter a date of form mm/yyyy");
              countries_with_dates[countries_to_animate[i].code]=parseInt(inp.split("/")[0])+12*parseInt(inp.split("/")[1]);
            }
            var vals=$.map(countries_with_dates, function(value, key) { return value });

            var min=vals[0];
            for (i = 0; i < vals.length; i++) {
              if (vals[i]<min) {
                min=vals[i];
              }
            }

            // console.log(min);
            //make smallest value t=0
            for (i = 0; i < countries_to_animate.length; i++) {
              // console.log(countries_with_dates[countries_to_animate[i].code]);
              countries_with_dates[countries_to_animate[i].code]=countries_with_dates[countries_to_animate[i].code]-min+offset;
            }
          }
        }

        function AnimateTravels() {
          // console.log("animation wanted");




        //probably want to just generate array of animations plus times tbh
        // var anims=getanimations(countries_with_dates);
        // for (i = 1; i < anims.length; i++) {
        //   anims[i][1]=anims[i][1]-anims[i-1][1];
        // }
        // z=0;
        // animate_map(anims);
        //
        // console.log(anims);

        var items=getItems(countries_with_dates);
        var items_copy = JSON.parse(JSON.stringify(items));
        for (i = 0; i < items.length-1; i++) {
            items[i][1]=items_copy[i][1]-items_copy[i+1][1];
            // console.log("items", items[i][1]);
            // console.log("items_copy", items_copy[i][1]);
        }
        // console.log(items);

        // makes map back to default
        for (var key in countries_with_dates){
          k=1
          j=data[1].data.findIndex((x) => { return x.code==key; })
          // console.log(j);
          pointClick(k,j);
        }

        z=items.length-1;
        console.log(items);
        setTimeout(animate_list,offset*animation_speed,items);


        // //need to be smarter than this loop
        // for (var key in countries_with_dates){
        //   k=0
        //   j=data[0].data.findIndex((x) => { return x.code==key; })
        //   console.log(j);
        //   setTimeout(pointClick(k,j), animation_speed*countries_with_dates[key]);
        //   setTimeout(()=>{console.log("timeout1");}, animation_speed*countries_with_dates[key]);
        // }
          }

          function animate_list(array) {
            console.log(z);
            j=data[0].data.findIndex((x) => { return x.code==array[z][0]; })
            pointClick(0,j);
            if (z>0){
            console.log(array[z-1][1]);
            setTimeout(animate_list, array[z-1][1]*animation_speed, array);
          }
          z--;
          }

          function animate_map(array) {
            console.log("go", z);
            mapChart.series[0].setData(array[z][0][0].data, false);
            mapChart.series[1].setData(array[z][0][1].data, true);
            z++;
            if (z==array.length) {}
            else {
              setTimeout(animate_map(array), array[z][1]*animation_speed)
            }
          }


          function getItems(dict){
            var start_data=[{
                name: 'Unvisited',
                data: codes.split(",").map(function (code) {
                    return { code: code };
                })
            }
            , {
                name: 'Visited',
                data: [].map(function (code) {
                    return { code: code };
                })
            }];
            // console.log(start_data);
            // console.log(codes);

          var animations=[];
          // Create items array
          var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
          });

          items.sort(function(first, second) {
            return second[1] - first[1];
          });

          return items;
          }

          function getanimations(dict) {

            var start_data=[{
                name: 'Unvisited',
                data: codes.split(",").map(function (code) {
                    return { code: code };
                })
            }
            , {
                name: 'Visited',
                data: [].map(function (code) {
                    return { code: code };
                })
            }];
            // console.log(start_data);
            // console.log(codes);

          var animations=[];
          // Create items array
          var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
          });

          new_array = JSON.parse(JSON.stringify(start_data));
          // Sort the array based on the second element
          items.sort(function(first, second) {
            return second[1] - first[1];
          });

          animations.push([start_data,0]);
          for (i = items.length-1; i>-1; i--){

            new_array=getArray(new_array,i,items);

            animations.push([new_array,items[i][1]]);
          }
          // console.log(animations);
          return animations;

          }

          function getArray(array, i,array_2) {
            state = JSON.parse(JSON.stringify(array));
            j=state[0].data.findIndex((x) => { return x.code==array_2[i][0]; })

            state[1].data.push({code: state[0].data[j].code});
            state[0].data.splice(j,1);
            return state;
          }
