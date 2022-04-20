

  function add(accumulator, a) {
    return accumulator + a;
  }

function ready(error, topo) {
  d3.json("/data/species", function(dd){
    d3.json("/data/countries", function(d){
      // data stuff
      for (var i = 0; i < topo.features.length; i++){
        topo.features[i].datum = d[topo.features[i].id.toLowerCase()]
        if (topo.features[i].datum != undefined){
          for (var j = 0; j < topo.features[i].datum.length; j++){
            var species_name = topo.features[i].datum[j][0]
            var area = topo.features[i].datum[j][1]
            topo.features[i].datum[j] = {}
            topo.features[i].datum[j].name = species_name
            topo.features[i].datum[j].area = area
            topo.features[i].datum[j].attr = dd[species_name];
            years.push(dd[species_name].year)
          }
        }
      }

      year_range = [Math.floor(d3.min(years)), Math.floor(d3.max(years))]
      //filter by taxa
      myList = [];
      for (var key in dd){
        myList.push.apply(myList, dd[key].taxa.replace(/ *\([^)]*\) */g, "").split(/[,;]+/));
      }
      const unique = [...new Set(myList)];
      unique.splice(unique.indexOf(""),1)
      unique.sort()
      unique.unshift("Everything")
      d3.select("#selectButton")
        .selectAll('myOptions')
       	.data(unique)
        .enter()
      	.append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })
        d3.select("#selectButton").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          tax_filter = selectedOption
          update(topo, filters, [year_range, tax_filter]);
      }) // correspond


      //slider bar
      var sliderRange = d3
    .sliderBottom()
    .min(d3.min(years))
    .max(d3.max(years))
    .width(300)
    .tickFormat(d3.format('4.0f'))
    .ticks(10)
    .default([d3.min(years), d3.max(years)])
    .fill('#2196f3')
    .on('onchange', val => {
      d3.select('p#value-range').text(val.map(d3.format('4.0f')).join('-'));
      year_range = [Math.floor(val[0]), Math.floor(val[1])]
      update(topo, filters, [year_range, tax_filter]);
    });

  var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);

  d3.select('p#value-range').text(
    sliderRange
      .value()
      .map(d3.format('4.0f'))
      .join('-')
  );


      update(topo, filters, [year_range, tax_filter]);

    });
  });
};

function yearFilter(input_data, value){
  ret = []
  if (input_data == undefined){
    return input_data
  }else {
    for (var i = 0; i < input_data.length; i++){
      if (input_data[i].attr.year <= value[1] && input_data[i].attr.year >= value[0]){
        ret.push(input_data[i])
      }
    }
    return ret;
  }
}

function taxFilter(input_data, value){
  ret = []

  if (input_data == undefined){
    return input_data
  }else {
    if (value == "Everything"){
      return input_data
    }
    for (var i = 0; i < input_data.length; i++){
      if (input_data[i].attr.taxa.includes(value)){
        ret.push(input_data[i])
      }
    }
  return ret;
}
}
function update(topo, funcs, value){

  let topo2 = JSON.parse(JSON.stringify(topo));


  var sizes = [];
  //update data
  if (funcs != null){
    for (var i = 0; i < topo.features.length; i++){
      var piece = topo.features[i].datum
      for(var j = 0; j < funcs.length; j++){
        piece = funcs[j](piece, value[j])
      }
      topo2.features[i].datum = piece
      if (topo2.features[i].datum != undefined){
        l = 0
        for (var j = 0; j < topo.features[i].datum.length; j++){
          l += topo.features[i].datum[j].area
        }
        //sizes.push(topo2.features[i].datum.length)
        sizes.push(l)
      } else{
        sizes.push(0)
      }
    }
  } else{
    for (var i = 0; i < topo.features.length; i++){
      if (topo2.features[i].datum != undefined){
        sizes.push(topo2.features[i].datum.length)
      } else{
        sizes.push(0)
      }
    }

  }

    var max = d3.max(sizes)
    var min = d3.min(sizes)
    var colorScale = d3.scaleSequential().domain([min,max])
    .interpolator(d3.interpolateRgb("purple", "orange"));

    //legenddd
          d3.select("#legend_svg").remove();
    var leg = d3.select("#legend")
      .append("svg")
      .attr("width",500)
      .attr("height",150)
      .attr("id", "legend_svg");

    var rects = leg.selectAll("rect")
      .data(d3.range(min, max, Math.floor((max - min) / 5)))
      .enter()
      .append("rect")
      .attr("width",15)
      .attr("height", 15)
      .attr("y", function(d,i) { return i * 20;})
      .attr("x", function(d,i) { return 15;})
      .attr("fill", function(d) { return colorScale(d); })

      leg.selectAll("text")
      .data(d3.range(min, max, Math.floor((max - min) / 5)))
      .enter()
      .append("text")
      .attr("y", function(d,i){return (i * 25) - 10;})
      .attr("x", function(d,i) { return 40;})
      .text(function(d) { return d; })

      //
      d3.select("#download")
      .on("click", function(d){
        var link = document.createElement('a');
        var file_name = country_name + "_" + tax_filter + "_" + year_range[0] + "-" + year_range[1] + ".txt"
        link.setAttribute('download', file_name);
        link.href = textFile;
        document.body.appendChild(link);

        // wait for the link to be added to the document
window.requestAnimationFrame(function () {
  var event = new MouseEvent('click');
  link.dispatchEvent(event);
  document.body.removeChild(link);
});
      })

  //draw map
  svg.append("g")
  .selectAll("path")
  .data(topo2.features)
  .enter()
  .append("path")
  .attr("d", d3.geoPath().projection(projection))
  .attr("fill", function (d) {
    l = "#808080"
    if (d.datum != undefined){
        //l = colorScale(d.datum.length);
        l = 0
        for (var i = 0; i < d.datum.length; i++){
          l += d.datum[i].area
        }
    }
    return colorScale(l);
  })
  .on('click',function(d){
    console.log(d)
    s = d3.select("#tb")
    t = ""
    a = []
    if (d.datum != undefined){
      country_name = d.properties.name
      for(var i = 0; i < d.datum.length; i++){
        t = d.datum[i].name
        a.push(t);
        s.append("text").attr("x", 20).attr("y", (i + 1)*20);
        s.text(t);
      }
    }
    var data = new Blob([a], {type: 'text/plain'});
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);

    updateList(d.datum)
  });
}

function updateList(list){

  if (list == null){
    return
  }
  d3.select("#sky").remove();
    var svgContainer = d3.select("#halfpage").append('svg')
        .attr('height', list.length * 60)
        .attr('width', 300)
        .attr('id', 'sky');


        //list
    svgContainer.selectAll("g")
                .data(list)
                .enter()
                .append("rect")
                .attr("width", 250)
                .attr("height", 30)
                .attr("x", 12)
                .attr("y", function(d, i){
                    return 50 * i;
                })
                .style("fill", "white")

                svgContainer.selectAll("text")
                .data(list)
                .enter()
                .append("text")
                    .attr("x", function(d) { return 15 })
                    .attr("y", function(d, i){
                        return 50 * i + 20;
                    })
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; })
                    .style('fill', 'Black')
                    .style('font-size',"20");

}
