SELECT name AS [Nombre]
 , CONVERT(VARCHAR,DATEADD(S,(run_time/10000)*60*60 /* hours */
 +((run_time - (run_time/10000) * 10000)/100) * 60 /* mins */
 + (run_time - (run_time/100) * 100) /* secs */
 ,CONVERT(DATETIME,RTRIM(run_date),113)),100) AS [Hora de Ejecucion]
 , [Siguiente Ejecucion] = ja.next_scheduled_run_date
 , CASE WHEN SJH.run_status=0 THEN 'Failed'
WHEN SJH.run_status=1 THEN 'Succeeded'
WHEN SJH.run_status=2 THEN 'Retry'
WHEN SJH.run_status=3 THEN 'Cancelled'
ELSE 'Unknown'
END [Resultado de la ultima ejecucion]
FROM sysjobhistory SJH
    JOIN sysjobs SJ
    ON SJH.job_id=sj.job_id
	INNER JOIN msdb.dbo.sysjobactivity ja 
    ON ja.job_id = SJH.job_id
    AND ja.run_requested_date IS NOT NULL
    AND ja.start_execution_date IS NOT NULL
WHERE step_id=0 and sjh.run_status != 1
    AND DATEADD(S,
 (run_time/10000)*60*60 /* hours */
 +((run_time - (run_time/10000) * 10000)/100) * 60 /* mins */
 + (run_time - (run_time/100) * 100) /* secs */,
 CONVERT(DATETIME,RTRIM(run_date),113)) >= DATEADD(d,-1,GetDate())
 AND enabled=1 
 AND ja.next_scheduled_run_date >= DATEADD(S,
 (run_time/10000)*60*60 /* hours */
 +((run_time - (run_time/10000) * 10000)/100) * 60 /* mins */
 + (run_time - (run_time/100) * 100) /* secs */,
 CONVERT(DATETIME,RTRIM(run_date),113)) 
 AND Year(ja.next_scheduled_run_date)=year(GETDATE())
ORDER BY name,run_date,run_time

