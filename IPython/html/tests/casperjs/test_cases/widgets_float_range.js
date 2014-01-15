// Test float range class
casper.notebook_test(function () {
    index = this.append_cell(
        'from IPython.html import widgets\n' + 
        'from IPython.display import display, clear_output\n' +
        'print("Success")');
    this.execute_cell_then(index);

    var slider_query = '.widget-area .widget-subarea .widget-hbox-single .slider';
    var float_text_query = '.widget-area .widget-subarea .widget-hbox-single .widget-numeric-text';

    var floatrange_index = this.append_cell(
        'floatrange = [widgets.BoundedFloatTextWidget(), \n' +
        '    widgets.FloatSliderWidget()]\n' +
        '[display(floatrange[i]) for i in range(2)]\n' + 
        'print("Success")\n');
    this.execute_cell_then(floatrange_index, function(index){

        this.test.assert(this.get_output_cell(index).text == 'Success\n', 
            'Create float range cell executed with correct output.');

        this.test.assert(this.cell_element_exists(index, 
            '.widget-area .widget-subarea'),
            'Widget subarea exists.');

        this.test.assert(this.cell_element_exists(index, slider_query),
            'Widget slider exists.');

        this.test.assert(this.cell_element_exists(index, float_text_query),
            'Widget float textbox exists.');
    });

    index = this.append_cell(
        'for widget in floatrange:\n' +
        '    widget.max = 50.0\n' +
        '    widget.min = -50.0\n' +
        '    widget.value = 20.0\n' +
        'print("Success")\n');
    this.execute_cell_then(index, function(index){

        this.test.assert(this.get_output_cell(index).text == 'Success\n', 
            'Float range properties cell executed with correct output.');

        this.test.assert(this.cell_element_exists(floatrange_index, slider_query), 
            'Widget slider exists.');

        this.test.assert(this.cell_element_function(floatrange_index, slider_query, 
            'slider', ['value']) == 20.0,
            'Slider set to Python value.');

        // Clear the float textbox value and then set it to 1 by emulating
        // keyboard presses.
        this.cell_element_function(floatrange_index, float_text_query, 'val', ['']);
        this.sendKeys(float_text_query, '1');
    });

    this.wait(1500); // Wait for change to execute in kernel

    index = this.append_cell('for widget in floatrange:\n    print(widget.value)\n');
    this.execute_cell_then(index, function(index){
        this.test.assert(this.get_output_cell(index).text == '1.0\n20.0\n', 
            'Float textbox set float range value');

        // Clear the float textbox value and then set it to 120 by emulating
        // keyboard presses.
        this.cell_element_function(floatrange_index, float_text_query, 'val', ['']);
        this.sendKeys(float_text_query, '120');
    });

    this.wait(500); // Wait for change to execute in kernel

    index = this.append_cell('print(floatrange[0].value)\n');
    this.execute_cell_then(index, function(index){
        this.test.assert(this.get_output_cell(index).text == '50.0\n', 
            'Float textbox value bound');

        // Clear the float textbox value and then set it to 'hello world' by 
        // emulating keyboard presses.  'hello world' should get filtered...
        this.cell_element_function(floatrange_index, float_text_query, 'val', ['']);
        this.sendKeys(float_text_query, 'hello world');
    });

    this.wait(500); // Wait for change to execute in kernel

    index = this.append_cell('print(floatrange[0].value)\n');
    this.execute_cell_then(index, function(index){
        this.test.assert(this.get_output_cell(index).text == '50.0\n', 
            'Invalid float textbox characters ignored');
    });
});