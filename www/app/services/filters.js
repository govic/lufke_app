angular
.module("lufke")
.filter("initCap", function(){
    return function initCap(_string){
        _string = _string.toLowerCase();
        var _1 = _string.charAt(0).toUpperCase();
        return _1 + _string.substr(1);
    }
})
.filter("shrinkNumber", function(){
    /*
        Filtro que formatea un numero "encogiendo" su formato. Se formatea hasta un rango de millones.
        Ejemplo
            { 100 | shrinkNumber } --> 100
            { 2001 | shrinkNumber } --> 2 K
            { 2701 | shrinkNumber } --> 2.7 K
            { 12701 | shrinkNumber } --> 13 K
            { 3001001 | shrinkNumber } --> 3 M
            { 3601001 | shrinkNumber } --> 3.6 M
    */
    return function shrinkNumber(number){
        if(typeof number === "number"){
            var _number = number.toString();

            //0 >= x <= 3
            if(0 < _number.length && 3 >= _number.length){
                return number;
            //4 >= x <= 6
            }else if(4 <= _number.length && 6 >= _number.length){
                return Trunk( number/1000 ) + " K";
            // x >= 7
            }else if(7 <= _number.length){
                return Trunk( number/1000000 ) + " M";
            }
        }
        return "?";

        function Trunk(_number){
            var number = _number;
            if(number > 10){
                number = Number( number.toFixed(0) );
            }else{
                number = Number( number.toFixed(1) );
            }
            return number;
        }
    }
});
