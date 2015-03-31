class TimeWatch
    constructor: ($el)->
        @$el = $el

        @settings =
            resumeTimeout: 100
            resumeStep: 1000

        @startWatch()

    startWatch: ->
        @_to = setInterval =>
            @setTime()
        , 500
        @setTime()

    setTime: ->
        @renderTime @getTime()

    getTime: ->
        date = new Date()
        time = date.getTime() - (date.getTimezoneOffset() * 60000)
        return time

    renderTime: (time)->
        time = Math.round((time / 1000) % 86400)

        hours   = Math.floor time / 3600
        minutes = Math.floor (time - hours * 3600) / 60
        seconds = Math.floor time - hours * 3600 - minutes * 60

        hours   = '0' + hours   if hours < 10
        minutes = '0' + minutes if minutes < 10
        seconds = '0' + seconds if seconds < 10

        @$el.text "#{hours}:#{minutes}:#{seconds}"

    pauseTime: ->
        @_stopTime = @getTime()
        clearInterval @_to

    resumeTime: ->
        if @_stopTime
            resume = =>
                setTimeout =>
                    @_stopTime += @settings.resumeStep
                    @renderTime @_stopTime

                    unless @_stopTime >= @getTime()
                        resume()
                    else
                        delete @_stopTime
                        @startWatch()

                , @settings.resumeTimeout

            resume()


class Bouble
    constructor: ($el, @timeWatch)->
        @settings =
            returnTime: 700

        @$el = $el
        @r = Raphael $el[0]

        @renderBouble()
        @addDragger()

    renderBouble: ->
        @path = @r.path().attr fill: "90-#4d57d0-#131ea8", "stroke-width": 0, path: @getBoublePath()

    updateBouble: (path)->
        @path.attr path: path

    returnBouble: ->
        @path.animate {path: @getBoublePath 0, 0}, @settings.returnTime, 'backOut'

    getBoublePath: (dx=0, dy=0)->
        fix = 0 + Math.abs(dy) / @getScaleX()
        fix = 0
        fx = 150 + dx / @getScaleX()
        fy = 120 + dy / @getScaleY()

        fx = if fx > 260 then 260 else fx
        fx = if fx < 40 then 40 else fx
        fy = if fy > 300 then 300 else fy
        fy = if fy < 120 then 120 else fy

        return "M0,0R#{fx},#{fy},300,0"

    getScaleX: ->
        return $('#bouble').width() / 300

    getScaleY: ->
        return $('#bouble').width() / 300

    addDragger: ->
        @dragCricle = @r.ellipse 150, 110, 40, 15
        @dragCricle.attr 'stroke-width': 0, fill: 'rgba(0,0,0,0)'
        @dragCricle.drag _.bind(@drag, @), _.bind(@dragStart, @), _.bind(@dragEnd, @)

    drag: (dx, dy, x, y)->
        @_dragParams =
            dx: dx
            dy: dy

        @updateBouble @getBoublePath dx, dy

    dragStart: ->
        @timeWatch.pauseTime()

    dragEnd: ->
        if @_dragParams
            @returnBouble()
            @timeWatch.resumeTime()
            delete @_dragParams


$ ->
    window.timeWatch = new TimeWatch $ '.time'
    window.bouble = new Bouble $('#bouble'), timeWatch
